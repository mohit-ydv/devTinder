const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mohitkrydv:MY2025DB@namastenode.xdrj3dy.mongodb.net/devTinder");
}

module.exports = connectDB;