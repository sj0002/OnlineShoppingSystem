const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Admin access required.' });
        }

        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        return res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: 'Server error while fetching users.' });
    }
};

const requestSeller = async (req, res) => {
    try {
        if (req.user.role !== 'Customer') {
            return res.status(400).json({ message: 'Only customers can request seller access.' });
        }

        if (req.user.sellerRequestStatus === 'Pending') {
            return res.status(409).json({ message: 'Your seller request is already pending.' });
        }

        const { businessName, contactNumber, storeAddress } = req.body;
        if (!businessName?.trim() || !contactNumber?.trim() || !storeAddress?.trim()) {
            return res.status(400).json({
                message: 'Business name, contact number and store address are required.'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                sellerRequestStatus: 'Pending',
                businessName: businessName.trim(),
                contactNumber: contactNumber.trim(),
                storeAddress: storeAddress.trim(),
                status: 'approved'
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            message: 'Seller request submitted successfully.',
            user
        });
    } catch (error) {
        console.error('Request seller error:', error);
        return res.status(500).json({ message: 'Server error while submitting seller request.' });
    }
};

module.exports = { getUsers, requestSeller };