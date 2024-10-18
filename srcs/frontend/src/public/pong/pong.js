const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Variáveis principais
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
const playerX = 10, aiX = canvas.width - paddleWidth - 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;

let playerScore = 0, aiScore = 0;
const maxScore = 5;

// Desenhar elementos
function drawPaddle(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
}

function moveAI() {
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 35) {
        aiY += 6;  // Velocidade da IA
    } else if (aiCenter > ballY + 35) {
        aiY -= 6;
    }
}

// Movimento da bola
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;  // Rebater nas bordas superior/inferior
    }

    // Colisão com a raquete do jogador
    if (ballX - ballSize < playerX + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Colisão com a raquete da IA
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
}

// Movimento do jogador com o mouse
canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    playerY = event.clientY - rect.top - paddleHeight / 2;
});

// Função principal de renderização
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

    drawPaddle(playerX, playerY);  // Desenha a raquete do jogador
    drawPaddle(aiX, aiY);  // Desenha a raquete da IA
    drawBall();  // Desenha a bola
    drawScore();  // Desenha o placar

    moveBall();  // Movimenta a bola
    moveAI();  // Movimenta a IA
}

// Executa o jogo continuamente
setInterval(draw, 1000 / 60);  // 60 frames por segundo