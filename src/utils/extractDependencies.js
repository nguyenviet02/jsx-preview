import { dependencyMap, internalDependencies } from '../dependencyMap';

// Function to extract dependencies from code
const extractDependencies = (code) => {
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

	// Validate that all dependencies are supported
	for (const dep of dependencies) {
		if (!dependencyMap[dep] && !internalDependencies.includes(dep)) {
			throw new Error(`The generated artifact uses libraries we don't support: ${dep}`);
		}
	}

	return dependencies;
};

export default extractDependencies;