import { startHost } from '../../dist/src'

document.getElementById('hostButton').onclick = () => {
	const latticePrefixInput = getInputValue(document.getElementById('latticePrefix'));
	const natsUrlInput = getInputValue(document.getElementById('natsUrl'));

	const latticePrefix = latticePrefixInput === null ? 'default' : latticePrefixInput;
	const natsUrl = natsUrlInput === null ? 'ws://localhost:6222' : natsUrlInput;

	(async () => {
		try {
			const host = await startHost(latticePrefix, false, [natsUrl])
			displayHost(host);
			window.host = host;
			alert(`Host ${host.friendlyName} launched successfully!`)
		} catch (e) {
			alert(e)
		}
	})();
}

function displayHost(host) {
	document.getElementById('hostFriendlyName').value = host.friendlyName;
	document.getElementById('hostId').value = host.key;
	document.getElementById('recommendation').innerHTML = '<span>Drag and drop a <a href="https://wasmcloud.com/docs/app-dev/create-actor/">wasmCloud WebAssembly actor</a> anywhere on this page to start it on this host.</span>';
	document.getElementById('hostButton').hidden = true;
	document.getElementById('runningHost').hidden = false;
	document.getElementById('dropZone').hidden = false;
}

function getInputValue(input) {
	if (input && input.value && input.value !== '') {
		return input.value;
	} else {
		return null;
	}
}

document.getElementById("dropZone").ondragover = (ev) => {
	// Prevent default behavior (Prevent file from being opened)
	ev.preventDefault();
	document.getElementById("pageBody").style.backgroundColor = "#00C389";
}

document.getElementById("dropZone").ondrop = (ev) => {
	// Prevent default behavior (Prevent file from being opened)
	ev.preventDefault();
	document.getElementById("pageBody").style.backgroundColor = "#D9E1E2";

	if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		[...ev.dataTransfer.items].forEach((item, i) => {
			// If dropped items aren't files, reject them
			if (item.kind === 'file') {
				const file = item.getAsFile();
				file.arrayBuffer().then(
					(buf) => {
						const bytes = new Uint8Array(buf);
						window.host.launchActorFromBytes(bytes).then((actor) => {
							document.getElementById('actors').appendChild(actorRow(actor));
							console.log("Launched actor successfully")
						}).catch((e) => {
							alert(e);
						});

					}
				);
			}
		});
	} else {
		// Use DataTransfer interface to access the file(s)
		[...ev.dataTransfer.files].forEach((file, i) => {
			console.log(`… file[${i}].name = ${file.name}`);
		});
	}
}

// Helper function to create the HTML for an actor's row 
function actorRow(actor) {
	const claims = actor.claims.wascap;
	let actorRow = document.createElement('tr');

	let nameValueTd = document.createElement('td');
	let nameValue = document.createElement('input');
	nameValue.disabled = true;
	nameValue.value = claims.name;
	nameValueTd.appendChild(nameValue);

	let verValueTd = document.createElement('td');
	let verValue = document.createElement('input');
	verValue.disabled = true;
	verValue.value = claims.ver;
	verValueTd.appendChild(verValue);

	let capsValueTd = document.createElement('td');
	let capsValue = document.createElement('input');
	capsValue.style.width = "310px";
	capsValue.disabled = true;
	capsValue.value = claims.caps.join(',');
	capsValueTd.appendChild(capsValue);

	actorRow.appendChild(nameValueTd);
	actorRow.appendChild(verValueTd);
	actorRow.appendChild(capsValueTd);

	return actorRow;
}