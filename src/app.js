const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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