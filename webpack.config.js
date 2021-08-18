const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const baseConfig = {
	stats: { assets: false, modules: false },
	mode: 'production',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, 'wasmcloud-rs-js'),
			extraArgs: '--target web',
			outDir: path.resolve(__dirname, 'wasmcloud-rs-js', 'pkg'),
			outName: 'wasmcloud_rs_js',
		})
	],
	experiments: {
		asyncWebAssembly: true,
	}
}

const nodeConfig = {
	target: 'node',
	output: {
		filename: 'index.node.js',
		path: path.resolve(__dirname, 'dist', 'src'),
		libraryTarget: 'commonjs',
		libraryExport: 'default',
		library: 'wasmcloudjs',
	},
}

const browserConfig = {
	output: {
		filename: 'index.bundle.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'wasmcloudjs',
	},
}

module.exports = () => {
	Object.assign(nodeConfig, baseConfig);
	Object.assign(browserConfig, baseConfig);
	return [browserConfig]
	//return [browserConfig, nodeConfig];
};