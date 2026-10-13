
const express = require('express');

const {
    getProducts,
    getProductById,
    searchProducts,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { protect, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all products (public)
router.get('/', getProducts);

// SEARCH products (public) - must be before /:id
router.get('/search', searchProducts);

// GET products belonging to the logged-in seller
router.get('/seller/my-products', protect, sellerOnly, getSellerProducts);

// CREATE product
router.post('/', protect, sellerOnly, createProduct);

// UPDATE product
router.put('/:id', protect, sellerOnly, updateProduct);

// DELETE product
router.delete('/:id', protect, sellerOnly, deleteProduct);

// GET single product by ID (public)
router.get('/:id', getProductById);

module.exports = router;
