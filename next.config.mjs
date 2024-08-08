import path from "path";

export default {
	output: "export",
	distDir: "./src/GUI/",
	webpack: (config) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			"@components": "/components",
			"@layout": "/layout",
		};
		return config;
	},
};
