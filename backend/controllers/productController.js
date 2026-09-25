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
// SEARCH PRODUCTS BY NAME  👈 අලුතින් add කරපු එක
// ============================
const searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';

        // Search box එක හිස් නම් → ඔක්කොම products එවන්න
        if (!query.trim()) {
            const allProducts = await Product.find()
                .populate('seller', 'name email');

            return res.status(200).json(allProducts);
        }

        // Name එකේ query එක තියෙන products හොයන්න (case-insensitive)
        const products = await Product.find({
            name: { $regex: query, $options: 'i' }
        }).populate('seller', 'name email');

        res.status(200).json(products);

    } catch (error) {
        console.error('Search products error:', error);

        res.status(500).json({
            message: 'Server error while searching products'
        });
    }
};


// ============================
// EXPORT
// ============================
module.exports = {
    getProducts,
    getProductById,
    searchProducts    // 👈 අලුතින් add කරපු එක
};