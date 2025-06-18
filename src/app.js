const express = require('express');

// Create an instance of this express application (new web server)
const app = express();

// Handle the incoming request
app.get("/user", (req, res) => {
    res.send({ firstname: "John", lastname: "Doe" });
});
app.post("/user", (req, res) => {
    res.send('This is a POST call.');
});

app.use("/users", (req, res, next) => {
    console.log('Response 1');
    next();
}, (req, res) => {
    console.log('Response 2');
    res.send('Hello, user! From 2nd handler');
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});