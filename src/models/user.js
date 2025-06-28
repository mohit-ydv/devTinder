const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is not a valid gender type'
        }
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is invalid");
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg',
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);