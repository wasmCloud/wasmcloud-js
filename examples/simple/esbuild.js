// Use this path in projects using the node import
let defaultWasmFileLocation = './node_modules/@wasmcloud/wasmcloud-js/dist/wasmcloud-rs-js/pkgwasmcloud.wasm'
let wasmFileLocationForLocal = '../../dist/wasmcloud-rs-js/pkg/wasmcloud.wasm'

let copyPlugin = {
	name: 'copy',
	setup(build) {
		require('fs').copyFile(wasmFileLocationForLocal, `${process.cwd()}/wasmcloud.wasm`, (err) => {
			if (err) throw err;
		});
	}
}
require('esbuild').build({
	entryPoints: ['main.js'],
	bundle: true,
	outfile: 'out-esbuild.js',
	plugins: [copyPlugin]
}).catch(() => process.exit(1))