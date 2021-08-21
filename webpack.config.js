const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const baseConfig = {
	stats: { assets: false, modules: false },
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	mode: 'production',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.wasm']
	},
	plugins: [
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, 'wasmcloud-rs-js'),
			extraArgs: '--target bundler',
			outDir: path.resolve(__dirname, 'wasmcloud-rs-js', 'pkg'),
			outName: 'wasmcloud_rs_js'
		})
	],
	experiments: {
		asyncWebAssembly: true
	}
}

const commonJSConfig = {
	output: {
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist', 'src'),
		libraryTarget: 'commonjs2',
		library: 'wasmcloudjs'
	}
}

const browserConfig = {
	output: {
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'wasmcloudjs'
	}
}

module.exports = (env) => {
	if (env.target === 'cjs') {
		return [{
			...commonJSConfig,
			...baseConfig
		}];
	} else {
		return [{
			...baseConfig,
			...browserConfig
		}];
	}

};