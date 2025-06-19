const mongoose = require('mongoose');
const validator = require('validator');

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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid: " + value);
            }
        }
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
        default: 'https://example.com/default-profile.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo url is invalid: " + value);
            }
        }
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