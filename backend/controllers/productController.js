const Product = require('../models/Product');

// GET ALL PRODUCTS
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

// GET PRODUCT BY ID
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

// SEARCH PRODUCTS BY NAME
const searchProducts = async (req, res) => {
    try {
        const query = req.query.q || '';
        const filter = query.trim()
            ? { name: { $regex: query, $options: 'i' } }
            : {};

        const products = await Product.find(filter)
            .populate('seller', 'name email');

        res.status(200).json(products);
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({
            message: 'Server error while searching products'
        });
    }
};

// GET LOGGED-IN SELLER'S PRODUCTS
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user._id
        }).populate('seller', 'name email');

        res.status(200).json(products);
    } catch (error) {
        console.error('Get seller products error:', error);
        res.status(500).json({
            message: 'Unable to fetch seller products'
        });
    }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stockQuantity,
            imageUrl
        } = req.body;

        if (
            !name?.trim() ||
            !description?.trim() ||
            !category?.trim() ||
            price === undefined ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: 'Please provide valid product details'
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            stockQuantity: Number(stockQuantity ?? 0),
            imageUrl: imageUrl || '',
            seller: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(400).json({
            message: error.message
        });
    }
};

// UPDATE OWN PRODUCT
const updateProduct = async (req, res) => {
    try {
        const allowedFields = [
            'name',
            'description',
            'price',
            'category',
            'stockQuantity',
            'imageUrl'
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.price !== undefined) {
            updates.price = Number(updates.price);

            if (!Number.isFinite(updates.price) || updates.price < 0) {
                return res.status(400).json({
                    message: 'Price must be a valid non-negative number'
                });
            }
        }

        if (updates.stockQuantity !== undefined) {
            updates.stockQuantity = Number(updates.stockQuantity);

            if (
                !Number.isInteger(updates.stockQuantity) ||
                updates.stockQuantity < 0
            ) {
                return res.status(400).json({
                    message: 'Stock must be a non-negative integer'
                });
            }
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                seller: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found or you do not own this product'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(400).json({
            message: error.message
        });
    }
};

// DELETE OWN PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found or you do not own this product'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            message: 'Unable to delete product'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    getSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct
};