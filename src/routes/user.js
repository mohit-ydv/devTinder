const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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

// Get the list of all the connections
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const allConnections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUser._id, status: 'accepted' },
                { toUserId: loggedinUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', [
            'firstName',
            'lastName',
            'age',
            'about'
        ]).populate('toUserId', [
            'firstName',
            'lastName',
            'age',
            'about'
        ]);
        const data = allConnections.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedinUser._id.toString()) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        });

        if (!allConnections || allConnections.length === 0) {
            return res.status(404).json({ message: 'No connection found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connections', error: error.message });
    }
});

// Get the feed for the logged-in user
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; // Limit to a maximum of 50 results per page

        const skip = (page - 1) * limit;

        // find all the connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUser._id },
                { toUserId: loggedinUser._id }
            ]
        }).select('fromUserId toUserId');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedinUser._id } }, // Exclude the logged-in user
                { _id: { $nin: Array.from(hideUsersFromFeed) } } // Exclude users in connection requests
            ]
        }).select('firstName lastName age about photoUrl skills').skip(skip).limit(limit);
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feed', error: error.message });
    }
});

module.exports = userRouter;