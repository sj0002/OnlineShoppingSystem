const User = require('../models/User');

// ============================
// GET PENDING SELLERS
// ============================
const getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({
            role: 'Seller',
            status: 'pending'
        }).select('-password');  // password එක එවන්නේ නෑ

        res.status(200).json(sellers);

    } catch (error) {
        console.error('Get pending sellers error:', error);

        res.status(500).json({
            message: 'Server error while fetching pending sellers'
        });
    }
};


// ============================
// APPROVE SELLER
// ============================
const approveSeller = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        if (seller.role !== 'Seller') {
            return res.status(400).json({
                message: 'This user is not a seller'
            });
        }

        seller.status = 'approved';
        await seller.save();

        res.status(200).json({
            message: 'Seller approved successfully',
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                status: seller.status
            }
        });

    } catch (error) {
        console.error('Approve seller error:', error);

        res.status(500).json({
            message: 'Server error while approving seller'
        });
    }
};


// ============================
// REJECT SELLER
// ============================
const rejectSeller = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        if (seller.role !== 'Seller') {
            return res.status(400).json({
                message: 'This user is not a seller'
            });
        }

        seller.status = 'rejected';
        await seller.save();

        res.status(200).json({
            message: 'Seller rejected successfully',
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                status: seller.status
            }
        });

    } catch (error) {
        console.error('Reject seller error:', error);

        res.status(500).json({
            message: 'Server error while rejecting seller'
        });
    }
};


// ============================
// EXPORT
// ============================
module.exports = {
    getPendingSellers,
    approveSeller,
    rejectSeller
};