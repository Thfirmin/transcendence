// Configurações iniciais da cena
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game').appendChild(renderer.domElement);
//document.body.appendChild(renderer.domElement);

// Luzes para iluminação
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 50, 50);
scene.add(pointLight);

// Configurações do campo de jogo
let fieldWidth = 400, fieldHeight = 200;
let paddleWidth = 10, paddleHeight = 30, paddleDepth = 10;


// // Criação da raquete do jogador
// let playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
// let playerPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
// let playerPaddle = new THREE.Mesh(playerPaddleGeometry, playerPaddleMaterial);
// playerPaddle.position.set(-fieldWidth / 2 + paddleWidth, 0, 0);
// scene.add(playerPaddle);

// // Criação da raquete da IA
// let aiPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
// let aiPaddleMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
// let aiPaddle = new THREE.Mesh(aiPaddleGeometry, aiPaddleMaterial);
// aiPaddle.position.set(fieldWidth / 2 - paddleWidth, 0, 0);
// scene.add(aiPaddle);


// Criação da bola

//let ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
//let ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
//let ball = new THREE.Mesh(ballGeometry, ballMaterial);
//ball.position.set(0, 0, 0);
//scene.add(ball);

// Loader para texturas
const textureLoader = new THREE.TextureLoader();
// Carregar texturas personalizadas
let playerPaddleTexture = textureLoader.load('images/paddle1.png');
let aiPaddleTexture = textureLoader.load('images/paddle2.png');
let ballTexture = textureLoader.load('images/ballTexture.png');
let backgroundTexture = textureLoader.load('images/backgroundTexture.jpg');

// Raquete do jogador com textura personalizada
let playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
let playerPaddleMaterial = new THREE.MeshLambertMaterial({ map: playerPaddleTexture });
let playerPaddle = new THREE.Mesh(playerPaddleGeometry, playerPaddleMaterial);
playerPaddle.position.set(-fieldWidth / 2 + paddleWidth, 0, 0);
scene.add(playerPaddle);

// Raquete da IA com textura personalizada
let aiPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
let aiPaddleMaterial = new THREE.MeshLambertMaterial({ map: aiPaddleTexture });
let aiPaddle = new THREE.Mesh(aiPaddleGeometry, aiPaddleMaterial);
aiPaddle.position.set(fieldWidth / 2 - paddleWidth, 0, 0);
scene.add(aiPaddle);

// Bola com textura personalizada
let ballRadius = 5;
let ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
let ballMaterial = new THREE.MeshLambertMaterial({ map: ballTexture });
let ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 0, 0);
scene.add(ball);

// Fundo personalizado com imagem
let planeGeometry = new THREE.PlaneGeometry(fieldWidth, fieldHeight);
let planeMaterial = new THREE.MeshLambertMaterial({ map: backgroundTexture, side: THREE.DoubleSide });
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -50);
scene.add(plane);

// Plano de fundo (parede) atrás das raquetes
//let planeGeometry = new THREE.PlaneGeometry(fieldWidth, fieldHeight);
//let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
//let plane = new THREE.Mesh(planeGeometry, planeMaterial);
//plane.position.set(0, 0, -50);
//scene.add(plane);

// Movimentação da câmera
camera.position.z = 300;

// Variáveis de movimento da bola
let ballSpeedX = 2, ballSpeedY = 2;

const ws = new WebSocket('ws://localhost:8000/ws/match/1/');

ws.onopen = function() {
	console.log('WebSocket connection established');
};

ws.onmessage = function(event) {
	console.log('Message received:', event.data);
}

ws.onclose = function() {
	console.log('WebSocket connection closed');
}

// Função de animação principal
//renderer.render(scene, camera);


function animate() {
    requestAnimationFrame(animate);

    // Movimentação da bola
    ball.position.x += ballSpeedX;
    ball.position.y += ballSpeedY;

    // Detecta colisão com as paredes superior e inferior
    if (ball.position.y + ballRadius > fieldHeight / 2 || ball.position.y - ballRadius < -fieldHeight / 2) {
        ballSpeedY = -ballSpeedY;
    }

    // Detecta colisão com a raquete do jogador
    if (ball.position.x - ballRadius < playerPaddle.position.x + paddleWidth / 2 &&
        ball.position.y < playerPaddle.position.y + paddleHeight / 2 &&
        ball.position.y > playerPaddle.position.y - paddleHeight / 2) {
        ballSpeedX = -ballSpeedX;
    }

    // Detecta colisão com a raquete da IA
    if (ball.position.x + ballRadius > aiPaddle.position.x - paddleWidth / 2 &&
        ball.position.y < aiPaddle.position.y + paddleHeight / 2 &&
        ball.position.y > aiPaddle.position.y - paddleHeight / 2) {
        ballSpeedX = -ballSpeedX;
    }

    // Reseta a bola se sair da tela (ponto para jogador ou IA)
    if (ball.position.x + ballRadius > fieldWidth / 2) {
        ball.position.set(0, 0, 0);
        ballSpeedX = -ballSpeedX;
    }

    if (ball.position.x - ballRadius < -fieldWidth / 2) {
        ball.position.set(0, 0, 0);
        ballSpeedX = -ballSpeedX;
    }

    // Movimenta a raquete da IA para seguir a bola
    aiPaddle.position.y += (ball.position.y - aiPaddle.position.y) * 0.05;

    // Renderiza a cena
    renderer.render(scene, camera);
}


// Movimentação da raquete do jogador com o mouse

window.addEventListener('mousemove', function(event) {
    let relativeY = (event.clientY / window.innerHeight) * 2 - 1;
    playerPaddle.position.y = relativeY * (fieldHeight / 2) * -1;
});


// Inicializa o jogo
animate();