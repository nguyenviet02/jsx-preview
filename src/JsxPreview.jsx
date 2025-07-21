import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { dependencyMap } from './dependencyMap';
import ErrorBoundary from './ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import extractDependencies from './utils/extractDependencies';

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

        // Remove import statements from the JSX code
        const codeWithoutImports = jsxCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');

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

        const { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } = moduleCache[dependencyMap['chart.js']] || {};
        const _ = moduleCache[dependencyMap['lodash']] || {};
        const clsx = moduleCache[dependencyMap['clsx']] || {};
        const recharts = moduleCache[dependencyMap['recharts']] || {};

        const reactDependencies = {
          React,
          useState,
          useEffect,
          useRef,
          useCallback,
          useMemo,
          useContext,
        };

        //* Dependencies that loaded directly from the code not from the dependencyMap
        const motionDependencies = dependencies.includes('framer-motion')
          ? {
              motion,
              AnimatePresence,
            }
          : {};

        //* Dependencies that loaded from the dependencyMap
        const chartJSDependencies = dependencies.includes('chart.js')
          ? {
              Chart,
              BarElement,
              CategoryScale,
              LinearScale,
              Tooltip,
              Legend,
              BarController,
            }
          : {};

        const lodashDependencies = dependencies.includes('lodash')
          ? {
              _,
            }
          : {};

        const rechartsDependencies = dependencies.includes('recharts')
          ? {
              recharts,
            }
          : {};

        const clsxDependencies = dependencies.includes('clsx')
          ? {
              clsx: clsx.default,
            }
          : {};

        // Organize dependencies into logical groups
        const injectedDependencies = {
          ...reactDependencies,
          ...chartJSDependencies,
          ...lodashDependencies,
          ...rechartsDependencies,
          ...motionDependencies,
          ...clsxDependencies,
        };

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
    <div className="jsx-preview">
      {error ? (
        <div className="error-message p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h3 className="font-bold">Error rendering JSX:</h3>
          <pre>{error}</pre>
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
        <div className="preview-container border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <div className="component-wrapper">
            <ErrorBoundary>{React.createElement(renderedComponent)}</ErrorBoundary>
          </div>
        </div>
      ) : (
        <div className="loading p-4 text-gray-500">Preparing to render JSX...</div>
      )}
    </div>
  );
};

export default JsxPreview;
