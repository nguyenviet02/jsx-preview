import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { dependencyMap } from './dependencyMap';
import ErrorBoundary from './ErrorBoundary';
import extractDependencies from './utils/extractDependencies';
import extractSpecificImports from './utils/extractSpecificImports';
import * as FramerMotionModule from 'framer-motion';
import * as RechartsModule from 'recharts';

// Component for dynamically rendering JSX code
const JsxPreview = ({ jsxCode }) => {
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState(null);
  const [moduleCache, setModuleCache] = useState({});
  const [loadingDependencies, setLoadingDependencies] = useState(false);

  // Function to load dependencies
  const loadDependencies = useCallback(async (dependencies, currentCache) => {
    // Load each dependency as ESM module
    try {
      const newModules = {};
      let hasNewModules = false;

      for (const dep of dependencies) {
        const url = dependencyMap[dep];

        if (url && !currentCache[url]) {
          setLoadingDependencies(true);
          try {
            const module = await import(/* @vite-ignore */ url);
            newModules[url] = module;
            hasNewModules = true;
            console.log(`Loaded ESM module for dependency: ${url}`, module);
          } catch (err) {
            console.error(`Failed to load ESM module: ${url}`, err);
            setLoadingDependencies(false);
            throw new Error(`Failed to load dependency: ${dep} (${err.message})`);
          }
        }
      }

      setLoadingDependencies(false);
      return { newModules, hasNewModules };
    } catch (error) {
      console.error('Error loading ESM modules:', error);
      setLoadingDependencies(false);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!jsxCode) return;

    const renderComponent = async () => {
      try {
        // Extract dependencies from code
        const dependencies = extractDependencies(jsxCode);

        // Load the dependencies
        const { newModules, hasNewModules } = await loadDependencies(dependencies, moduleCache);

        // Update module cache if needed
        if (hasNewModules) {
          setModuleCache((prevCache) => ({
            ...prevCache,
            ...newModules,
          }));

          // Exit early to avoid rendering with incomplete dependencies
          // The effect will run again after moduleCache updates
          return;
        }

        console.log('Using dependencies:', dependencies);

        // Remove import statements from the JSX code - now with 's' flag to handle multi-line imports
        const codeWithoutImports = jsxCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/gs, '');

        // Handle export statements by capturing the component name and removing exports
        let codeToTransform = codeWithoutImports;
        let exportedComponentName = 'Component';

        // Find default export and extract component name
        const defaultExportMatch = codeToTransform.match(/export\s+default\s+([A-Za-z0-9_]+)/);
        if (defaultExportMatch && defaultExportMatch[1]) {
          exportedComponentName = defaultExportMatch[1];
          console.log('Found exported component name:', exportedComponentName);
        }

        // Remove all export statements
        codeToTransform = codeToTransform.replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '');
        codeToTransform = codeToTransform.replace(/export\s+default\s+/g, '');
        codeToTransform = codeToTransform.replace(/export\s+/g, '');

        // Use Babel to transform JSX to JavaScript
        const transformedCode = window.Babel.transform(codeToTransform, {
          presets: ['react'],
        }).code;

        // Prepare injected dependencies
        const injectedDependencies = {};

        //* Add React dependencies
        const reactDependencies = {
          React,
          useState,
          useEffect,
          useRef,
          useCallback,
          useMemo,
          useContext,
        };
        Object.assign(injectedDependencies, reactDependencies);

        //* Handle chart.js dynamic imports
        if (dependencies.includes('chart.js')) {
          const chartComponents = extractSpecificImports(jsxCode, 'chart.js');
          console.log('☠️ ~ renderComponent ~ chartComponents:', chartComponents);
          const chartModule = moduleCache[dependencyMap['chart.js']];

          if (chartModule) {
            chartComponents.forEach((component) => {
              if (chartModule[component]) {
                injectedDependencies[component] = chartModule[component];
              }
            });
          }
        }

        //* Handle lodash
        if (dependencies.includes('lodash')) {
          injectedDependencies._ = moduleCache[dependencyMap['lodash']] || {};
        }

        //* Handle clsx
        if (dependencies.includes('clsx')) {
          const clsxModule = moduleCache[dependencyMap['clsx']];
          injectedDependencies.clsx = clsxModule?.default || clsxModule;
        }

        //* Handle recharts
        if (dependencies.includes('recharts')) {
          const rechartsComponents = extractSpecificImports(jsxCode, 'recharts');

          if (RechartsModule) {
            // If specific components were imported
            if (rechartsComponents.length > 0) {
              rechartsComponents.forEach((component) => {
                if (RechartsModule[component]) {
                  injectedDependencies[component] = RechartsModule[component];
                }
              });
            } else {
              // Fall back to providing the entire module
              injectedDependencies.recharts = RechartsModule;
            }
          }
        }

        //* Handle framer-motion
        if (dependencies.includes('framer-motion') || dependencies.includes('motion')) {
          const motionComponents = extractSpecificImports(jsxCode, 'framer-motion');

          // If specific components were imported
          if (motionComponents.length > 0) {
            motionComponents.forEach((component) => {
              if (FramerMotionModule[component]) {
                injectedDependencies[component] = FramerMotionModule[component];
              }
            });
          } else {
            // Fall back to providing common motion components
            Object.assign(injectedDependencies, {
              ...FramerMotionModule,
            });
          }
        }

        //* Handle lucide-react
        if (dependencies.includes('lucide-react')) {
          const lucideComponents = extractSpecificImports(jsxCode, 'lucide-react');
          const lucideModule = moduleCache[dependencyMap['lucide-react']];

          if (lucideModule) {
            lucideComponents.forEach((component) => {
              if (lucideModule[component]) {
                injectedDependencies[component] = lucideModule[component];
              }
            });
          }
        }

        //* Handle mathjs
        if (dependencies.includes('mathjs')) {
          const mathjsComponents = extractSpecificImports(jsxCode, 'mathjs');
          const mathjsModule = moduleCache[dependencyMap['mathjs']];

          if (mathjsModule) {
            mathjsComponents.forEach((component) => {
              if (mathjsModule[component]) {
                injectedDependencies[component] = mathjsModule[component];
              }
            });
          }
        }

        // Get dependency names and values as separate arrays
        const dependencyNames = Object.keys(injectedDependencies);

        const dependencyValues = Object.values(injectedDependencies);

        // Create a function from the transformed code that returns the component
        const executeCode = new Function(
          ...dependencyNames,
          `
          ${transformedCode}
          return ${exportedComponentName};
          `
        );

        // Execute the code with all dependencies passed in
        try {
          const DynamicComponent = executeCode(...dependencyValues);

          // Set the rendered component
          setRenderedComponent(() => DynamicComponent);
          setError(null);
        } catch (execError) {
          console.error('Error executing component code:', execError);
          setError(`Error executing component: ${execError.toString()}`);
        }
      } catch (transformError) {
        console.error('Error transforming JSX:', transformError);
        setError(`Error transforming JSX: ${transformError.toString()}`);
      }
    };

    // Start the rendering process
    renderComponent();
  }, [jsxCode, moduleCache, loadDependencies]);

  // Render the dynamic component or error message
  return (
    <>
      {error ? (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h3 className="font-bold">Error rendering JSX:</h3>
          <pre className="text-wrap whitespace-break-spaces">{error}</pre>
        </div>
      ) : loadingDependencies ? (
        <div className="loading-dependencies p-4">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-600 font-medium">Loading ESM modules...</span>
          </div>
        </div>
      ) : renderedComponent ? (
        <ErrorBoundary>{React.createElement(renderedComponent)}</ErrorBoundary>
      ) : (
        <div className="loading p-4 text-gray-500">Preparing to render JSX...</div>
      )}
    </>
  );
};

export default JsxPreview;
