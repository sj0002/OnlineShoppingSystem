const User = require('../models/User');
const Order = require('../models/Order');

const getReportSummary = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Admin access required.' });
        }

        const [orderSummary, userSummary] = await Promise.all([
            Order.aggregate([
                { $match: { status: { $ne: 'Cancelled' } } },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: '$totalAmount' },
                        totalOrders: { $sum: 1 }
                    }
                }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: null,
                        activeSellers: {
                            $sum: { $cond: [{ $eq: ['$role', 'Seller'] }, 1, 0] }
                        },
                        registeredCustomers: {
                            $sum: { $cond: [{ $eq: ['$role', 'Customer'] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);

        const orders = orderSummary[0] || {};
        const users = userSummary[0] || {};

        return res.status(200).json({
            totalSales: orders.totalSales || 0,
            totalOrders: orders.totalOrders || 0,
            activeSellers: users.activeSellers || 0,
            registeredCustomers: users.registeredCustomers || 0
        });
    } catch (error) {
        console.error('Get report summary error:', error);
        return res.status(500).json({ message: 'Server error while generating reports.' });
    }
};

// ============================
// GET PENDING SELLERS
// ============================
const getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({
            role: 'Customer',
            sellerRequestStatus: 'Pending'
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

        if (seller.role !== 'Customer' || seller.sellerRequestStatus !== 'Pending') {
            return res.status(400).json({
                message: 'This user does not have a pending seller request'
            });
        }

        seller.role = 'Seller';
        seller.sellerRequestStatus = 'Approved';
        seller.status = 'approved';
        await seller.save();

        res.status(200).json({
            message: 'Seller approved successfully',
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                businessName: seller.businessName,
                contactNumber: seller.contactNumber,
                storeAddress: seller.storeAddress,
                role: seller.role,
                status: seller.status,
                sellerRequestStatus: seller.sellerRequestStatus
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

        if (seller.role !== 'Customer' || seller.sellerRequestStatus !== 'Pending') {
            return res.status(400).json({
                message: 'This user does not have a pending seller request'
            });
        }

        seller.sellerRequestStatus = 'Rejected';
        seller.status = 'rejected';
        await seller.save();

        res.status(200).json({
            message: 'Seller rejected successfully',
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                status: seller.status,
                sellerRequestStatus: seller.sellerRequestStatus
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
    getReportSummary,
    getPendingSellers,
    approveSeller,
    rejectSeller
};