const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:userid', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userid;
        const status = req.params.status;

        // validate the status
        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status provided. Allowed statuses are 'ignored' or 'interested'."
            });
        };

        // check if the target user exists in the database
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "Target user not found."
            });
        }

        // check if there is already a connection request from the user to the target user or vice versa
        // use $or operator to check both directions
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists between these users."
            });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        })
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "An error occurred while sending the connection request."
        });
    }
});

requestRouter.post('/request/review/:status/:requestid', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestid } = req.params;

        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status provided. Allowed statuses are 'accepted' or 'rejected'."
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestid,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        
        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found or already reviewed."
            });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Connection request ${status} successfully.`,
            data
        });

    } catch (error) {
        res.status(400).json({
            message: error.message || "An error occurred while reviewing the connection request."
        });

    }
});

module.exports = requestRouter;