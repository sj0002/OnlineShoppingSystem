const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This connects to the MONGO_URI you just put in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connection established successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Stops the server if the database fails to connect
    }
};

module.exports = connectDB;