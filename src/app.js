const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/signup', async (req, res) => {
    // Creating an instance of the User model
    const newUser = new User(req.body);

    await newUser.save()
        .then(() => {
            res.status(201).json({ message: 'User created successfully' });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error creating user', error: err.message });
        });
});

// Connect to the database
connectDB().then(() => {
    console.log("Connected to MongoDB successfully");
    // Start the server on port 3000
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}).catch(err => {
    console.log("Error connecting to MongoDB:", err.message);
});