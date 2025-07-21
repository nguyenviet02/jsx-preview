import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { dependencyMap } from './dependencyMap';
import ErrorBoundary from './ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

// Component for dynamically rendering JSX code
const JsxPreview = ({ jsxCode }) => {
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState(null);
  const [moduleCache, setModuleCache] = useState({});

  // Function to extract and load dependencies
  const extractAndLoadDependencies = async (code) => {
    // Extract import statements using regex
    const importRegex = /import\s+.*?from\s+['"](.*?)['"];?/g;
    let match;
    const dependencies = [];

    // Find all import statements and extract the package names
    while ((match = importRegex.exec(code)) !== null) {
      const packagePath = match[1];

      // Only consider external packages (not relative imports)
      if (!packagePath.startsWith('.') && !packagePath.startsWith('/')) {
        // Extract the package name, handling scoped packages correctly
        let mainPackage;
        if (packagePath.startsWith('@')) {
          // For scoped packages like @mui/material, include both scope and package name
          const parts = packagePath.split('/');
          if (parts.length >= 2) {
            mainPackage = `${parts[0]}/${parts[1]}`;
          }
        } else {
          // For regular packages, just take the first part
          mainPackage = packagePath.split('/')[0];
        }

        if (mainPackage && !dependencies.includes(mainPackage)) {
          dependencies.push(mainPackage);
        }
      }
    }

    // Validate that all dependencies are supported
    for (const dep of dependencies) {
      if (!dependencyMap[dep]) {
        throw new Error(`The generated artifact uses libraries we don't support: ${dep}`);
      }
    }

    // Load each dependency as ESM module
    try {
      for (const dep of dependencies) {
        const url = dependencyMap[dep];

        if (url && !moduleCache[url]) {
          try {
            const module = await import(/* @vite-ignore */ url);
            moduleCache[url] = module;
            console.log(`Loaded ESM module for dependency: ${url}`, module);
          } catch (err) {
            console.error(`Failed to load ESM module: ${url}`, err);
            throw new Error(`Failed to load dependency: ${dep} (${err.message})`);
          }
        }
      }

      // Update the module cache state
      setModuleCache({ ...moduleCache });

      return dependencies;
    } catch (error) {
      console.error('Error loading ESM modules:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!jsxCode) return;

    const renderComponent = async () => {
      try {
        // Extract and load dependencies before processing the code
        const loadedDependencies = await extractAndLoadDependencies(jsxCode);
        console.log('Loaded dependencies:', loadedDependencies);

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

        const { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } = moduleCache[dependencyMap['chart.js']];
        const _ = moduleCache[dependencyMap['lodash']];
        const clsx = moduleCache[dependencyMap['clsx']];
        const recharts = moduleCache[dependencyMap['recharts']];

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
        const motionDependencies = loadedDependencies.includes('framer-motion')
          ? {
              motion,
              AnimatePresence,
            }
          : {};

        //* Dependencies that loaded from the dependencyMap
        const chartJSDependencies = loadedDependencies.includes('chart.js')
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

        const lodashDependencies = loadedDependencies.includes('lodash')
          ? {
              _,
            }
          : {};

        const rechartsDependencies = loadedDependencies.includes('recharts')
          ? {
              recharts,
            }
          : {};

        const clsxDependencies = loadedDependencies.includes('clsx')
          ? {
              clsx: clsx.default,
            }
          : {};

        // Organize dependencies into logical groups
        const dependencies = {
          ...reactDependencies,
          ...chartJSDependencies,
          ...lodashDependencies,
          ...rechartsDependencies,
          ...motionDependencies,
          ...clsxDependencies,
        };

        // Get dependency names and values as separate arrays
        const dependencyNames = Object.keys(dependencies);
        const dependencyValues = Object.values(dependencies);

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
  }, [jsxCode]);

  // Render the dynamic component or error message
  return (
    <div className="jsx-preview">
      {error ? (
        <div className="error-message p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h3 className="font-bold">Error rendering JSX:</h3>
          <pre>{error}</pre>
        </div>
      ) : renderedComponent ? (
        <div className="preview-container border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <div className="component-wrapper">
            <ErrorBoundary>{React.createElement(renderedComponent)}</ErrorBoundary>
          </div>
        </div>
      ) : (
        <div className="loading p-4 text-gray-500">Loading dependencies and rendering JSX...</div>
      )}
    </div>
  );
};

export default JsxPreview;

