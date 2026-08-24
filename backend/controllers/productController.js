const Product = require('../models/Product');

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
// EXPORT
// ============================
module.exports = {
    getProducts
};