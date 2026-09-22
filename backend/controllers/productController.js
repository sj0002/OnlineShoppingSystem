const Product = require('../models/Product');
const User = require('../models/User');

// ============================
// GET ALL PRODUCTS
// ============================
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name email');

        res.status(200).json(products);

    } catch (error) {
        console.error('Get products error:', error);

        res.status(500).json({
            message: 'Server error while fetching products'
        });
    }
};


// ============================
// GET PRODUCT BY ID
// ============================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email');

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error('Get product by ID error:', error);

        res.status(500).json({
            message: 'Server error while fetching product'
        });
    }
};


// ============================
// EXPORT
// ============================
module.exports = {
    getProducts,
    getProductById
};