import { startHost } from '../../dist/src'

// Importing inside of a project
// import { startHost } from '@wasmcloud/wasmcloud-js';
// const { startHost } = require('@wasmcloud/wasmcloud-js');

var runningHosts = [];

document.getElementById('hostButton').onclick = () => {
	const latticePrefixInput = document.getElementById('latticePrefix');
	if (!latticePrefixInput || !latticePrefixInput.value || latticePrefixInput.value === '') {
		//TODO: help duplication here
		(async () => {
			const host = await startHost('374b6434-f18d-4b93-8743-bcd3089e4d5b', false, ['ws://localhost:6222'])
			runningHosts.push(host);
			document.getElementById('runningHosts').innerHTML = hostList(runningHosts).innerHTML
			console.dir(runningHosts);
		})();
	} else {
		(async () => {
			const host = await startHost(latticePrefixInput.value, false, ['ws://localhost:6222'])
			runningHosts.push(host);
			document.getElementById('runningHosts').innerHTML = hostList(runningHosts).innerHTML
			console.dir(runningHosts);
		})();
	}
}

function hostList(runningHosts) {
	let list = document.createElement('ol');
	runningHosts.forEach((host) => {
		console.dir(host)
		let listItem = document.createElement('li');
		listItem.innerText = host.friendlyName;
		list.appendChild(listItem);
	});
	return list;
}