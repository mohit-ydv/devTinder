const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignupData } = require('../utils/validation');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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

        const savedUser = await newUser.save();
        const token = await savedUser.getJWT();
        res.cookie('token', token, { expires: new Date(Date.now() + 3600000) });

        res.status(200).json({
            message: 'User Added Successfully!',
            data: savedUser
        });
    } catch (error) {
        // This catches validation errors and prevents server crash
        res.status(400).json({ message: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = await user.getJWT();
        res.cookie('token', token, { expires: new Date(Date.now() + 3600000) });
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

authRouter.post('/logout', async (req, res) => {
    // cleanup the cookie by setting it to null and expiring it
    res.cookie('token', null, { expires: new Date(Date.now()) });
    res.status(200).json({ message: 'Logout successful' });
})

module.exports = authRouter;
