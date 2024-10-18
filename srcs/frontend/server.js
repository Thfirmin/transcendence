const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'src/public')));

// Handle client-side routing: always serve index.html
app.get('*', (req, res, next) => {
    // Check if the request is for a file (like JS or CSS) and skip serving index.html
    if (req.path.includes('.')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});