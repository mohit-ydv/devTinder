const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

// Create an instance of this express application (new web server)
const app = express();

app.use("/admin", adminAuth);

app.get("/admin", (req, res) => {
    res.send("Hello, Admin!");
});

app.get("/admin/getAllUsers", (req, res) => {
    res.send("List of all users");
});

// Handle the incoming request
app.get("/user", userAuth, (req, res) => {
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