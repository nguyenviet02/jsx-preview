import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import ErrorBoundary from './ErrorBoundary';
import {extractDependencies, extractNamespaceImports, extractSpecificImports} from './utils/extractDependencies'


// Modules are statically imported directly into the bundle. Any libraries you want to support need to be imported here.
import * as FramerMotionModule from 'framer-motion';
import * as RechartsModule from 'recharts';
import * as LucideReactModule from 'lucide-react';
import * as lodashModule from 'lodash';
import * as clsxModule from 'clsx';
import * as mathjsModule from 'mathjs';
import * as ReactModule from 'react'


const JsxPreview = ({ jsxCode }) => {
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState(null);

  const staticallyImportedModules = useMemo(() => ({
    'framer-motion': FramerMotionModule,
    'recharts': RechartsModule,
    'lucide-react': LucideReactModule,
    'lodash': lodashModule,
    'clsx': clsxModule,
    'mathjs': mathjsModule,
    'react': ReactModule,
  }), []);


  useEffect(() => {
    if (!jsxCode) {
      setRenderedComponent(null);
      setError(null);
      return;
    }

    const renderComponent = () => {
      try {
        // Extract dependent libraries from code
        const dependencies = extractDependencies(jsxCode);
        for (const dep of dependencies) {
          if (!staticallyImportedModules[dep]) {
            throw new Error(`The generated artifact uses libraries we don't support: ${dep}`);
          }
        }
        const namespaceImports = extractNamespaceImports(jsxCode);

        // Remove import statements from JSX code
        const codeWithoutImports = jsxCode.replace(/import\s+.*?from\s+['"].*?['"];?\s*/gs, '');

        // Processing export statements
        let codeToTransform = codeWithoutImports;
        let exportedComponentName = 'Component';
        const defaultExportMatch = codeToTransform.match(/export\s+default\s+([A-Za-z0-9_]+)/);
        if (defaultExportMatch && defaultExportMatch[1]) {
          exportedComponentName = defaultExportMatch[1];
        }
        codeToTransform = codeToTransform.replace(/export\s+default\s+[A-Za-z0-9_]+;?/g, '');
        codeToTransform = codeToTransform.replace(/export\s+default\s+/g, '');
        codeToTransform = codeToTransform.replace(/export\s+/g, '');

        // Using Babel to Convert JSX to JavaScript
        const transformedCode = window.Babel.transform(codeToTransform, {
          presets: ['react'],
        }).code;

        // Prepare the libraries to be injected
        const injectedDependencies = {
          React,
          useState,
          useEffect,
          useRef,
          useCallback,
          useMemo,
          useContext,
        };

        // Handling namespace imports (import * as X from 'Y')
        for (const moduleName in namespaceImports) {
          if (Object.hasOwnProperty.call(namespaceImports, moduleName)) {
            const alias = namespaceImports[moduleName];
            const loadedModule = staticallyImportedModules[moduleName];

            if (loadedModule) {
              injectedDependencies[alias] = loadedModule;
            } else {
               console.warn(`Module '${moduleName}' is required but not statically imported in JsxPreview.jsx.`);
            }
          }
        }
        
        // Handling named imports and default imports
        dependencies.forEach(dep => {
            const loadedModule = staticallyImportedModules[dep];
            if (!loadedModule) {
                console.warn(`The module '${dep}' is required but not statically imported in JsxPreview.jsx.`);
                return;
            }

            const specificImports = extractSpecificImports(jsxCode, dep);
            if (specificImports.length > 0) {
                specificImports.forEach(component => {
                    const parts = component.split(/\s+as\s+/);
                    const originalName = parts[0];
                    const aliasName = parts.length > 1 ? parts[1] : originalName;

                    if (originalName === 'default' && loadedModule.default) {
                         injectedDependencies[aliasName] = loadedModule.default;
                    } else if (loadedModule[originalName]) {
                        injectedDependencies[aliasName] = loadedModule[originalName];
                    }
                });
            }
            
            // Handling import default: import X from '...'
            const defaultImportMatch = new RegExp(`import\\s+([A-Za-z0-9_$]+)\\s+from\\s+['"]${dep}['"]`);
            const match = jsxCode.match(defaultImportMatch);
            if (match && match[1] && loadedModule.default) {
               injectedDependencies[match[1]] = loadedModule.default;
            }
        });

        const dependencyNames = Object.keys(injectedDependencies);
        const dependencyValues = Object.values(injectedDependencies);

        const executeCode = new Function(
          ...dependencyNames,
          `
          ${transformedCode}
          return ${exportedComponentName};
          `
        );

        try {
          const DynamicComponent = executeCode(...dependencyValues);
          setRenderedComponent(() => DynamicComponent);
          setError(null);
        } catch (execError) {
          console.error('Error executing component code:', execError);
          setError(`Error executing component code: ${execError.toString()}`);
        }
      } catch (transformError) {
        console.error('Error converting JSX:', transformError);
        setError(`Error converting JSX: ${transformError.toString()}`);
      }
    };

    renderComponent();
  }, [jsxCode, staticallyImportedModules]);

  return (
    <>
      {error ? (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded">
          <h3 className="font-bold">Error rendering JSX:</h3>
          <pre className="text-wrap whitespace-break-spaces">{error}</pre>
        </div>
      ) : renderedComponent ? (
        <ErrorBoundary key={jsxCode}>{React.createElement(renderedComponent)}</ErrorBoundary>
      ) : (
        <div className="loading p-4 text-gray-500">Preparing to render JSX...</div>
      )}
    </>
  );
};

export default JsxPreview;