function onLogin() {
	const username = document.getElementById('username').value;

	fetch('http://localhost:3001/login/',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username }),
		}
	).then(
		(response) => {
			if (response.status === 201) {
				console.log('Login successful');
			} else {
				alert('Login failed');
			}
		}
	)
	.catch(
		(error) => {
			console.error('Errsor:', error);
		}
	);
}