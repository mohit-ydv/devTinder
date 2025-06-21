const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateSignupData, validateEditProfileData } = require('../utils/validation');

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
        console.log("Updated user data: ", loggedinUser);
        await loggedinUser.save();
        res.json({ message: "Profile updated successfully", data: loggedinUser });
    } catch (err) {
        res.status(400).send("Error fetching profile: " + err.message);
    }
});

module.exports = profileRouter;