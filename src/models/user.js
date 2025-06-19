const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is invalid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://example.com/default-profile.png'
    },
    about: {
        type: String,
        default: 'New User'
    },
    skills: {
        type: [String]
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);