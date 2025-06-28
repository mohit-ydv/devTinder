const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL);
}

module.exports = connectDB;