const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3001;
const secretKey = 'vchastin';

app.use(express.json());
app.use(cors());

// Simula uma lista de logins ativos (no mundo real, isso seria gerenciado de forma mais segura e persistente)
let activeLogins = [];

// Função para gerar o Bearer Token
function generateBearerToken(payload) {
    // Defina o tempo de expiração do token (opcional, por exemplo, 1 hora)
    const options = { expiresIn: '1h' };

    // Gera o token com a carga útil (payload), a chave secreta e as opções
    const token = jwt.sign(payload, secretKey, options);

    // Retorna o token no formato Bearer
    return `Bearer ${token}`;
}

// Rota GET - Retorna a lista de logins ativos no momento
app.get('/login', (req, res) => {
    res.json(activeLogins);
});

// Rota POST - Adiciona um novo login
app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Verifica se o usuário já está logado
    const userAlreadyLoggedIn = activeLogins.some((login) => login.username === username);
    if (userAlreadyLoggedIn) {
        return res.status(400).json({ message: 'User is already logged in' });
    }

	const loginData = {
		username: username,
		id:	activeLogins.length + 1,
	}

	// Gera o token de autenticação
	const token = generateBearerToken(loginData);
	loginData.token = token;

    // Adiciona o novo login à lista de logins ativos
    activeLogins.push(loginData);
    res.status(201).json({ message: loginData });
});

// Rota DELETE - Remove um login (Logout)
app.delete('/logout', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Verifica se o usuário está logado
    const index = activeLogins.findIndex((login) => login.username === username);
    if (index === -1) {
        return res.status(404).json({ message: 'User is not logged in' });
    }

    // Remove o usuário da lista de logins ativos
    activeLogins.splice(index, 1);
	return res.status(201).json({ message: `User ${username} logged out successfully` });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});