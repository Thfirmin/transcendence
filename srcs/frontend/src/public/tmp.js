// Conectar ao WebSocket
const socket = new WebSocket('ws://localhost:8000/ws/somepath/');

socket.onopen = function(e) {
	console.log('WebSocket connection opened.');
};

socket.onmessage = function(e) {
	//const data = JSON.parse(event.data);
	//console.log('Estado recebido:', data);
	const data = JSON.parse(e.data);
	const message = data.message;

	// Adiciona a mensagem recebida ao div
	const messagesDiv = document.getElementById('messages');
	messagesDiv.innerHTML += `<p>${message}</p>`;
};

socket.onclose = function(e) {
	console.log('WebSocket connection closed.');
};

socket.onerror = function(e) {
	console.error('WebSocket error:', e);
};

// Enviar uma mensagem para o WebSocket quando o botão é clicado
document.getElementById('sendButton').onclick = function() {
	const input = document.getElementById('messageInput');
	const message = input.value;

	console.log("message: ", message);
	socket.send(JSON.stringify({
		'message': message
	}));

	input.value = '';  // Limpar o campo de entrada
};