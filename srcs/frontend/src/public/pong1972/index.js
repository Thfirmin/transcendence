const user = {}
const mainId = "main-div";
const hostname = '25.45.252.73'

// Função para iniciar o jogo após conectar-se à API e ao WebSocket
async function BeginGame() {
	try {
		// Conectar ao WebSocket com o matchId retornado pela API
		const matchId = user.matchId;
		const ws = new WebSocket(`ws://${hostname}:8000/ws/match/${matchId}/`);

		ws.onopen = () => {
			console.log(`Conectado ao WebSocket da partida: ${matchId}`);
		};

		ws.onmessage = (message) => {
			console.log("Mensagem recebida do WebSocket:", message.data);
			// Aqui você pode atualizar o estado do jogo baseado nas mensagens recebidas
		};

		ws.onclose = () => {
			console.log(`WebSocket da partida ${matchId} desconectado`);
		};

		ws.onerror = (error) => {
			console.error("Erro no WebSocket:", error);
		};

		// Iniciar o jogo Pong
		startPong(mainId);
	} catch (error) {
		console.error('Erro ao iniciar o jogo:', error);
	}
}

// Função para iniciar o jogo Pong
function startPong() {
	const container = document.getElementById(mainId);

	const canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	canvas.classList.add("pong-game");
	container.appendChild(canvas);

	// Iniciar o loop do jogo Pong
	startGameLoop(canvas);
}

// Função que contém a lógica do jogo Pong
function startGameLoop(canvas) {
	const ctx = canvas.getContext("2d");

	// Variáveis do jogo
	const paddleWidth = 10, paddleHeight = 100;
	const ballSize = 10, playerX = 10, aiX = canvas.width - paddleWidth - 10;
	let playerY = (canvas.height - paddleHeight) / 2;
	let aiY = (canvas.height - paddleHeight) / 2;
	let ballX = canvas.width / 2, ballY = canvas.height / 2;
	let ballSpeedX = 4, ballSpeedY = 4;
	let playerScore = 0, aiScore = 0;
	const maxScore = 5;

	// Funções de desenho
	const drawPaddle = (x, y) => {
		ctx.fillStyle = "black";
		ctx.fillRect(x, y, paddleWidth, paddleHeight);
	};

	const drawBall = () => {
		ctx.beginPath();
		ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	};

	const drawScore = () => {
		ctx.font = "32px Arial";
		ctx.fillText(playerScore, canvas.width / 4, 50);
		ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
	};

	// Funções de movimento
	const resetBall = () => {
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
		ballSpeedX = -ballSpeedX;
		ballSpeedY = 4;
	};

	const moveAI = () => {
		const aiCenter = aiY + paddleHeight / 2;
		if (aiCenter < ballY - 35) aiY += 6;
		else if (aiCenter > ballY + 35) aiY -= 6;
	};

	const moveBall = () => {
		ballX += ballSpeedX;
		ballY += ballSpeedY;

		if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
			ballSpeedY = -ballSpeedY; // Rebater nas bordas superior/inferior
		}

		// Colisões com as raquetes
		if (ballX - ballSize < playerX + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
			ballSpeedX = -ballSpeedX;
		}

		if (ballX + ballSize > aiX && ballY > aiY && ballY < aiY + paddleHeight) {
			ballSpeedX = -ballSpeedX;
		}

		// Verificar se alguém marcou ponto
		if (ballX - ballSize < 0) {
			aiScore++;
			if (aiScore === maxScore) {
				alert("IA venceu!");
				document.location.reload();
			} else {
				resetBall();
			}
		}

		if (ballX + ballSize > canvas.width) {
			playerScore++;
			if (playerScore === maxScore) {
				alert("Você venceu!");
				document.location.reload();
			} else {
				resetBall();
			}
		}
	};

	// Evento de movimentação do jogador com o mouse
	canvas.addEventListener("mousemove", (event) => {
		const rect = canvas.getBoundingClientRect();
		playerY = event.clientY - rect.top - paddleHeight / 2;
	});

	// Função principal de renderização do jogo
	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawPaddle(playerX, playerY);
		drawPaddle(aiX, aiY);
		drawBall();
		drawScore();
		moveBall();
		moveAI();
	};

	// Iniciar o loop do jogo com 60 FPS
	setInterval(draw, 1000 / 60);
}

async function getMatch(username, token)
{
	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, token }),
	};
	const response = await fetch(`http://${hostname}:8000/pong/matchmaker/`, requestData);
	const data = await response.json();
	return data.match_id;
}

// generate a random username for the user
async function login() {
	user.username = `user-${Math.floor(Math.random() * 1000)}`;

	const requestData = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username: user.username })
	};

	const response = await fetch(`http://${hostname}:8000/pong/login/`, requestData);
	const data = await response.json();
	user.token = data.token;
	user.matchId = await getMatch(user.username, user.token);
}

login().then(
	(response) => {
		console.log("You've been succefully logged in!!! XD");
		console.log("username:", user.username);
		console.log("token:", user.token);
		console.log("matchId:", user.matchId);
		BeginGame();
	}
)