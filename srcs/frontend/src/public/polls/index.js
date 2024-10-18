const mainDiv = document.getElementById('main-div');

const button = document.createElement('button');
const button2 = document.createElement('button');

const messageInput = document.createElement('input');
const messageInput2 = document.createElement('input');

const br = document.createElement('br');
const br2 = document.createElement('br');

button2.innerHTML = 'connect';

messageInput2.placeholder = 'Type a id of socket to connect';

button.innerHTML = 'click here';

messageInput.placeholder = 'Type a message to send to the server';

mainDiv.appendChild(button2);
mainDiv.appendChild(messageInput2);

mainDiv.appendChild(br);
mainDiv.appendChild(br2);

mainDiv.appendChild(button);
mainDiv.appendChild(messageInput);

let socket = null;

function connectWebSocket() {
	if (messageInput2.value === '') {
		console.log('Type a id of socket to connect');
		return
	}
	// Verifique se o WebSocket já está conectado ou se está tentando conectar
	if (!socket || socket.readyState === WebSocket.CLOSED) {
		socket = new WebSocket('ws://localhost:8000/ws/match/' + messageInput2.value + '/');

		socket.onopen = function(e) {
			console.log("Connection established");
		};

		socket.onmessage = function(event) {
			const data = JSON.parse(event.data);
			console.log("Message from server:", data.message);
		};

		socket.onclose = function(event) {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
			} else {
				console.log('Connection died');
			}
		};

		socket.onerror = function(error) {
			console.log("WebSocket error: " + error.message);
		};
	} else {
		console.log("WebSocket connection already established.");
	}
}

// Função que será chamada ao clicar no botão
function onButtonClick() {
	if (socket && socket.readyState === WebSocket.OPEN) {
		// Enviar mensagem se a conexão já estiver aberta
		socket.send(JSON.stringify({message: messageInput.value}));
		messageInput.value = '';
	}
}

button2.addEventListener('click', connectWebSocket);
button.addEventListener('click', onButtonClick);