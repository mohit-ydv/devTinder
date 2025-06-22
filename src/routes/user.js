const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

// Get all the pending connection requests for the logged-in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const requests = await ConnectionRequest.find({ toUserId: loggedinUser._id, status: 'interested' }).populate('fromUserId', [
            'firstName',
            'lastName'
        ]);
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No connection requests found' });
        }
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connections', error: error.message });
    }
});

module.exports = userRouter;