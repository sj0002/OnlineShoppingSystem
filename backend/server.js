require('dotenv').config(); // Loads the variables from your .env file
const express = require('express');
const connectDB = require('./config/db'); // Imports your DB connection function

// Initialize the Express application
const app = express();

// Execute the database connection
connectDB();

// Middleware to parse incoming JSON data
app.use(express.json());

// A simple test route to verify the server is working
app.get('/', (req, res) => {
    res.send('Online Shopping System API is running...');
});

// Define the port (uses the one in .env, or defaults to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});