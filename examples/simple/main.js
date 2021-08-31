import { startHost } from '../../dist/src'

// Importing inside of a project
// import { startHost } from '@wasmcloud/wasmcloud-js';
// const { startHost } = require('@wasmcloud/wasmcloud-js');

(async () => {
	console.log('USING A JS BUNDLER')
	const host = await startHost('default', false, ['ws://localhost:4222'])
	console.log(host);
})()