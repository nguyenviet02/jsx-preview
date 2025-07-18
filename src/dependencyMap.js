export const dependencyMap = {
	react: ['https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js', 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js'],

	'react-router-dom': [
		'https://cdn.jsdelivr.net/npm/react-router-dom@6.15.0/dist/umd/react-router-dom.production.min.js',
		'https://cdn.jsdelivr.net/npm/react-router@6.15.0/dist/umd/react-router.production.min.js',
	],

	'@mui/material': [
		'https://cdn.jsdelivr.net/npm/@mui/material@5.14.5/umd/material-ui.production.min.js',
		'https://cdn.jsdelivr.net/npm/@emotion/react@11.11.1/dist/emotion-react.umd.min.js',
		'https://cdn.jsdelivr.net/npm/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js',
	],

	'chart.js': ['https://cdn.jsdelivr.net/npm/chart.js@4.3.3/dist/chart.umd.min.js', 'https://cdn.jsdelivr.net/npm/moment@2.29.4/min/moment.min.js'],

	axios: ['https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js'],

	lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js'],

	recharts: ['https://cdn.jsdelivr.net/npm/recharts@2.7.3/umd/Recharts.min.js'],

	'framer-motion': ['https://cdn.jsdelivr.net/npm/framer-motion@11.12.0/dist/framer-motion.min.js'],

	'clsx': ['https://cdn.jsdelivr.net/npm/clsx@2.1.1/dist/clsx.min.js'],
	// Add more dependencies as needed
};

export const checkLoadedDependencies = (dependencies) => {
	return dependencies.every((dep) => {
		if (dep === 'lodash') return window._ !== undefined;
		if (dep === 'react') return window.React !== undefined;
		if (dep === 'react-router-dom') return window.ReactRouterDOM !== undefined;
		if (dep === '@mui/material') return window.MaterialUI !== undefined;
		if (dep === 'chart.js') return window.Chart !== undefined;
		if (dep === 'axios') return window.axios !== undefined;
		if (dep === 'recharts') return window.Recharts !== undefined;
		if (dep === 'framer-motion') return window.FramerMotion !== undefined;
		if (dep === 'clsx') return window.clsx !== undefined;
		return true; // Default to true for unknown dependencies
	});
};