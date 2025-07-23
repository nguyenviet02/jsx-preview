// Function to extract specific imports from a dependency
const extractSpecificImports = (jsxCode, dependency) => {
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

export default extractSpecificImports;