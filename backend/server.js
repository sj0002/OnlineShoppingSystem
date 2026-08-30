require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Product routes
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Online Shopping System API is running...');
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});