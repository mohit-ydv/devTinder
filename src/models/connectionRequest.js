const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'accepted', 'rejected', 'interested'],
            message: '{VALUE} is not a valid status'
        },
    }
}, { timestamps: true });

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // check if the user is trying to send a connection request to themselves
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
});

const ConnectionRequest = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;