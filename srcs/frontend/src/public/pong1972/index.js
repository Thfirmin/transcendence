const mainId = "main-div";
// Função para obter os dados de login do localStorage
function getLoginData() {
	const rawJsonData = localStorage.getItem('loginData');
	if (!rawJsonData) return null;
	return JSON.parse(rawJsonData).message;
}

// Função para renderizar o formulário de login ou o jogo dependendo do estado
function renderLogin() {
	const loginData = getLoginData();
	if (loginData) {
		startPong(mainId); // Se já estiver logado, iniciar o jogo
		return;
	}

	const login = document.getElementById(mainId);
	login.innerHTML = `
		<div style="text-align: center; max-width: 300px; margin: 0 auto;">
			<h1>Login</h1>
			<input type="text" id="username" placeholder="Username" style="color: black; margin: 10px 0; padding: 5px;">
			<button id="loginButton" style="color: black; margin: 10px 0; padding: 5px;">Login</button>
		</div>
	`;

	// Adicionando evento ao botão de login de forma mais limpa
	document.getElementById('loginButton').addEventListener('click', onLogin);
}

// Função de login com async/await para facilitar a leitura
async function onLogin() {
	const username = document.getElementById('username').value;
	try {
		const response = await fetch('http://25.45.252.73:3001/login/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username })
		});

		if (response.status === 201) {
			const data = await response.json();
			localStorage.setItem('loginData', JSON.stringify(data));
			console.log('Login successful');
			startPong("main-div"); // Iniciar o jogo após o login
		} else {
			alert('Login failed');
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

// Função de logout com async/await
async function onLogout() {
	const loginData = getLoginData();
	if (!loginData) return;

	try {
		const response = await fetch('http://25.45.252.73:3001/logout/', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: loginData.username })
		});

		if (response.status === 201) {
			localStorage.removeItem('loginData');
			console.log('Logout successful');
			renderLogin("main-div"); // Retornar à tela de login após o logout
		} else {
			alert('Logout failed');
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

// Função para iniciar o jogo Pong
function startPong() {
	const container = document.getElementById(mainId);
	container.innerHTML = `
		<div style="text-align: center; max-width: 300px; margin: 0 auto;">
			<button id="logoutButton" style="color: black; margin: 10px 0; padding: 5px;">Logout</button>
		</div>
	`;
	
	const canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	canvas.classList.add("pong-game");
	container.appendChild(canvas);

	// Associando o botão de logout
	document.getElementById('logoutButton').addEventListener('click', onLogout);

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

// Iniciar a renderização da tela de login
renderLogin("main-div");