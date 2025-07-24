// Function to extract dependencies from code
export const extractDependencies = (code) => {
	// Extract import statements using regex with 's' flag to handle multi-line imports
	const importRegex = /import\s+.*?from\s+['"](.*?)['"];?/gs;
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

	return dependencies;
};

// Function to extract specific imports from a dependency
export const extractSpecificImports = (jsxCode, dependency) => {
	// Match imports like: import { A, B, C } from 'dependency';
	// Using 's' flag to make . match newlines
	const importRegex = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+['"]${dependency}['"]`, 'gs');
	const matches = Array.from(jsxCode.matchAll(importRegex));

	if (matches.length === 0) return [];

	// Extract the imported components and clean up whitespace
	const importedComponents = matches.flatMap((match) => {
		return match[1].split(',').map((comp) => comp.trim());
	});

	return importedComponents;
};


export const extractNamespaceImports = (code) => {
  const namespaceImports = {};
  // Regex to find "import * as Alias from 'module'"
  const regex = /import\s+\*\s+as\s+([a-zA-Z0-9_$]+)\s+from\s+['"](.*?)['"]/gi;
  let match;

  while ((match = regex.exec(code)) !== null) {
    // match[1] is an alias (eg "THREE")
    // match[2] is the module name (eg "three")
    const alias = match[1];
    const moduleName = match[2];
    namespaceImports[moduleName] = alias;
  }

  return namespaceImports;
};