const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        // console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI,);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;

