const express = require('express');

// Create an instance of this express application (new web server)
const app = express();

// Handle the incoming request
app.use((req, res) => {
    res.send('Hello, World! This is my first Express.js application.');
})

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});