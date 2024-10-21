const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3001;
const secretKey = 'vchastin';

app.use(express.json());
app.use(cors());

// Simula uma lista de logins ativos (no mundo real, isso seria gerenciado de forma mais segura e persistente)
let accountList = [];

// Função para gerar o Bearer Token
function generateToken(payload) {
    // Defina o tempo de expiração do token para 1 dia
    const options = { expiresIn: '1d' };

    // Gera o token com a carga útil (payload), a chave secreta e as opções
    const token = jwt.sign(payload, secretKey, options);

    // Retorna o token no formato Bearer
    return token;
}

// Get payload from token
function	extractPayload(token) {
	const payload = {
		data: null,
		status: false,
		error: null,
	};

	try {
		payload.data = jwt.verify(token, secretKey);
		payload.status = true;
		return payload;
	}
	catch (error)
	{
		payload.error = error.name;
		return payload;
	}
}

function	isUserRegistered(username) {
	return accountList.some((login) => login.username === username);
}

function	registerUser(username) {
	const loginData = {
		username: username,
		email: `${username}@example.com`,
		id:	accountList.length + 1,
	}

	// Gera o token de autenticação
	const token = generateToken(loginData);

    // Adiciona o novo login à lista de logins ativos
    accountList.push(loginData);
	return token;
}

// Rota GET - Retorna a lista de logins ativos no momento
app.get('/account', (req, res) => {
    res.status(200).json({ data: accountList });
});

app.get('/user/:token', (req, res) => {
	const { token } = req.params;
	const payload = extractPayload(token);

	if (!payload.status) {
		return res.status(404).json({ error: payload.error });
	}

	res.status(200).json({ data: payload.data });
})

app.post('/login', (req, res) => {
	const { username } = req.body;
	let	token;

	if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Verifica se o usuário já está logado
    const userAlreadyExists = isUserRegistered(username);
    if (!userAlreadyExists) {
		// redirect to register
		token = registerUser(username);
    }
	else
	{
		const loginData = accountList.find((login) => login.username === username);
		token = generateToken(loginData);
	}
	
	res.status(201).json({ data: token });
});

// Rota POST - Adiciona um novo login
app.post('/register', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Verifica se o usuário já está logado
    const userAlreadyExists = isUserRegistered(username);
    if (userAlreadyExists) {
        return res.status(400).json({ error: 'User is already registered' });
    }

	const token = registerUser(username);

    res.status(201).json({ data: token });
});

// Rota DELETE - Remove um login (Logout)
app.delete('/delete/:token', (req, res) => {
    const { token } = req.params;
	const payload = extractPayload(token);

	if (!payload.status) {
		return res.status(404).json({ error: payload.error });
	}

    // Verifica se o usuário está logado
    const index = accountList.findIndex((login) => login.username === payload.data.username);
    if (index === -1) {
        return res.status(404).json({ error: 'User is not logged in' });
    }

    // Remove o usuário da lista de logins ativos
    accountList.splice(index, 1);
	return res.status(201).json({ message: `User ${payload.data.username} has been successfully deleted` });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});