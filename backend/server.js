const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001; 

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// A simple, empty placeholder route
app.get('/', (req, res) => {
    res.status(200).send("Backend server is running!");
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});