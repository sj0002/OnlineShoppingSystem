const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res) => {
    try {
        let categories = await Category.find({})
            .select('name -_id')
            .sort({ name: 1 });

        if (categories.length === 0) {
            const productCategories = await Product.distinct('category');
            categories = productCategories
                .filter(Boolean)
                .sort()
                .map((name) => ({ name }));
        }

        return res.status(200).json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({
            message: 'Server error while fetching categories.'
        });
    }
};

module.exports = { getCategories };