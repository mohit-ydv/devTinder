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

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

// // delete user
// app.delete('/user', async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching user', error: error.message });
//     }
// });

// // update user
// app.patch('/user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'skills', 'age'];
//         const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
//         if (!isUpdateAllowed) {
//             throw new Error("Update not allowed");
//         }
//         if (data?.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10");
//         }
//         const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//             runValidators: true,
//         });
//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching user', error: error.message });
//     }
// });

// // Global error handler to catch any unhandled errors
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

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