const express = require('express');

const {
    getProducts,
    getProductById,
    searchProducts    // 👈 අලුතින් add කරපු එක
} = require('../controllers/productController');

const router = express.Router();

// GET all products
router.get('/', getProducts);

// 👇 SEARCH route එක (⚠️ `/:id` එකට උඩින් තියෙන්න ඕන!)
router.get('/search', searchProducts);

// GET single product by ID
router.get('/:id', getProductById);

module.exports = router;