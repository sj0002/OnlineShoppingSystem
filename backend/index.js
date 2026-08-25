const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Online Shopping System Backend is running!');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(5000, () => {
            console.log('Server running on http://localhost:5000');
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });