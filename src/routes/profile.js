const express = require('express');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validatePasswordForUpdate } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        // Get the user from the request object
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send("Error fetching profile: " + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit profile data");
        }
        const loggedinUser = req.user;
        Object.keys(req.body).forEach((key) => loggedinUser[key] = req.body[key]);
        await loggedinUser.save();
        res.json({ message: "Profile updated successfully", data: loggedinUser });
    } catch (err) {
        res.status(400).send("Error fetching profile: " + err.message);
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        if (!validatePasswordForUpdate(req)) {
            throw new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }
        const loggedinUser = req.user;
        const { password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        loggedinUser.password = passwordHash;
        loggedinUser.save();
        await res.cookie('token', null, { expires: new Date(Date.now()) }); // Clear the cookie
        res.send({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).send("Error updating password: " + error.message);
    }
});

module.exports = profileRouter;