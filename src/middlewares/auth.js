const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to authenticate user using JWT token
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Please login" });
        }

        const decodedObj = jwt.verify(token, "DEV@Tinder@25");
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    userAuth
};
