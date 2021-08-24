const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

const baseConfig = {
	stats: { assets: false, modules: false, errors: true },
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
			outDir: path.resolve(__dirname, 'wasmcloud-rs-js', 'pkg')
		})
	],
	experiments: {
		asyncWebAssembly: true
	}
}

const commonJSConfig = {
	output: {
		webassemblyModuleFilename: 'wasmcloud.wasm',
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist', 'cjs'),
		libraryTarget: 'commonjs2',
		library: 'wasmcloudjs'
	}
}

const browserConfig = {
	output: {
		webassemblyModuleFilename: 'wasmcloud.wasm',
		filename: 'wasmcloud.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'wasmcloudjs'
	}
}

module.exports = (env) => {
	if (env.target === 'cjs') {
		baseConfig.plugins.push(
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'wasmcloud-rs-js/pkg/*.wasm*'),
						to: path.resolve(__dirname, 'dist/')
					}
				]
			})
		)
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