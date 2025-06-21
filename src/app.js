const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { validateSignupData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post('/signup', async (req, res) => {
    try {
        // Validate the request body
        validateSignupData(req.body);

        const { firstName, lastName, emailId, password } = req.body;
        // Hash the password before saving it to the database
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating an instance of the User model
        const newUser = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        await newUser.save()
            .then(() => {
                res.status(201).json({ message: 'User created successfully' });
            })
            .catch(err => {
                res.status(500).json({ message: 'Error creating user', error: err.message });
            });
    } catch (error) {
        // This catches validation errors and prevents server crash
        res.status(400).json({ message: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // create a JWT token
        const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@25", {
            expiresIn: '1h'
        });

        // Set the token in a cookie
        res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        // If the password is valid, return a success message or user data
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/profile', userAuth, async (req, res) => {
    try {
        // Get the user from the request object
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send("Error fetching profile: " + err.message);
    }
})

app.get('/user', async (req, res) => {
    const emailId = req.body.emailId;
    try {
        const users = await User.find({ emailId: emailId });
        if (users.length === 0) {
            res.status(404).json({ message: 'No user found with the provided emailId' });
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

app.get('/feed', async (req, res) => {
    try {
        // Check if the token is present in cookies
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // validate the token
        const decoded = jwt.verify(token, "DEV@Tinder@25");
        const decodedUserId = decoded._id;
        console.log("Decoded User ID: ", decodedUserId);

        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// delete user
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// update user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'skills', 'age'];
        const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true,
        });
        res.send("User updated successfully");
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Global error handler to catch any unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
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