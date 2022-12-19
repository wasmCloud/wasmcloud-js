const path = require('path');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	stats: { assets: false, modules: false },
	entry: './main.js',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	// this is needed to copy the wasm file used by the js code to initiate a host key/extract the token from a signed actor
	// this SHOULD go away once the upstream webpack build issues are resolved (webpack will automatically pick up the webpack file without needing a copy)
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					// the node_module path should be referenced in projects using the node import
					// from: 'node_modules/@wasmcloud/wasmcloud-js/dist/*.wasm',
					from: '../../dist/wasmcloud-rs-js/pkg/*.wasm',
					to: '[name].wasm'
				}
			]
		})
	],
	mode: 'production',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.wasm']
	},
	experiments: {
		asyncWebAssembly: true
	},
	output: {
		filename: 'out-webpack.js',
		path: path.resolve(__dirname, '')
	}
}