import React, { useState, useEffect } from 'react';
import { dependencyMap, checkLoadedDependencies } from './dependencyMap';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './ErrorBoundary';

// Component for dynamically rendering JSX code
const JsxPreview = ({ jsxCode }) => {
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState(null);

  // Function to extract and load dependencies
  const extractAndLoadDependencies = (code) => {
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

    // Dependency map: library name -> CDN URLs for dependencies

    // Validate that all dependencies are supported
    for (const dep of dependencies) {
      if (!dependencyMap[dep]) {
        throw new Error(`The generated artifact uses libraries we don't support: ${dep}`);
      }
    }

    // Load each dependency that isn't already loaded
    dependencies.forEach((dep) => {
      const cdnUrls = dependencyMap[dep] || [];

      cdnUrls.forEach((cdnUrl) => {
        // Create a unique ID based on the URL
        const scriptId = `dependency-${cdnUrl.replace(/[^a-zA-Z0-9]/g, '-')}`;

        // Check if script already exists
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.src = cdnUrl;
          script.id = scriptId;

          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
          console.log(`Added script for dependency: ${cdnUrl}`);
        } else {
          console.log(`Script already exists for: ${cdnUrl}`);
        }
      });
    });

    return dependencies;
  };

  useEffect(() => {
    if (!jsxCode) return;

    try {
      // Extract and load dependencies before processing the code
      const loadedDependencies = extractAndLoadDependencies(jsxCode);
      console.log('Loaded dependencies:', loadedDependencies);

      // Wait for dependencies to load
      const waitForDependencies = () => {
        // Check if all dependencies are available
        const allLoaded = checkLoadedDependencies(loadedDependencies);

        if (allLoaded) {
          console.log('All dependencies loaded successfully');
          renderComponent();
        } else {
          console.log('Waiting for dependencies to load...');
          setTimeout(waitForDependencies, 200);
        }
      };

      // Function to render the component after dependencies are loaded
      const renderComponent = () => {
        try {
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

          const ChartJsImports = window.Chart
            ? `
          // Import Chart.js components into local scope
          const { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } = window.Chart;
        	`
            : '';

          // Create a function from the transformed code that returns the component
          const executeCode = new Function(
            'React',
            'useState',
            'useEffect',
            'useRef',
            'useCallback',
            'useMemo',
            'useContext',
            'motion',
            'AnimatePresence',
            `
            // ${ChartJsImports}
            ${transformedCode}
            return ${exportedComponentName};
            `
          );

          // Execute the code with React and hooks passed in
          try {
            const DynamicComponent = executeCode(React, React.useState, React.useEffect, React.useRef, React.useCallback, React.useMemo, React.useContext, motion, AnimatePresence);

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

      // Start checking for dependencies
      waitForDependencies();
    } catch (err) {
      console.error('Error transforming or rendering JSX:', err);
      setError(err.toString());
    }
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
        <div className="loading p-4 text-gray-500">Waiting for JSX code...</div>
      )}
    </div>
  );
};

export default JsxPreview;

