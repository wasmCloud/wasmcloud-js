const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const sharedConfig = {
	stats: { assets: false, modules: false, errors: true },
	mode: 'production',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.wasm']
	},
	experiments: {
		asyncWebAssembly: true
	}
}

// base
const baseConfig = {
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

	plugins: [
		new WasmPackPlugin({
			crateDirectory: path.resolve(__dirname, 'wasmcloud-rs-js'),
			extraArgs: '--target bundler',
			outDir: path.resolve(__dirname, 'wasmcloud-rs-js', 'pkg')
		})
	],
	...sharedConfig
}

// this is used for require(wasmcloudjs) or import { wasmcloudjs } from 'dist/cjs/'
const commonJSConfig = {
	output: {
		webassemblyModuleFilename: 'wasmcloud.wasm',
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist', 'cjs'),
		libraryTarget: 'commonjs',
		library: 'wasmcloudjs'
	}
}

// this is specifically to use in a script tag
const browserConfig = {
	output: {
		webassemblyModuleFilename: 'wasmcloud.wasm',
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'wasmcloudjs'
	}
}

// this is used to bundle the rust wasm code in order to properly import into the compiled typescript code in the dist/src dir
const wasmConfig = {
	entry: './wasmcloud-rs-js/pkg/index.js',
	output: {
		webassemblyModuleFilename: 'wasmcloud.wasm',
		filename: 'index.js',
		libraryTarget: 'commonjs2',
		path: path.resolve(__dirname, 'dist', 'wasmcloud-rs-js', 'pkg')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	...sharedConfig
}

module.exports = (env) => {
	switch (env.target) {
		case 'cjs':
			return [{
				...commonJSConfig,
				...baseConfig
			}];
		case 'wasm':
			return wasmConfig
		default:
			return [{
				...baseConfig,
				...browserConfig
			}];
	}
};