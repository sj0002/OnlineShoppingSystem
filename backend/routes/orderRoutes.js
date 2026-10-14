const express = require('express');

const {
    createOrder,
    getSellerOrders,
    updateSellerOrderStatus
} = require('../controllers/orderController');

const { protect, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/seller/my-orders', protect, sellerOnly, getSellerOrders);
router.patch('/:id/status', protect, sellerOnly, updateSellerOrderStatus);

module.exports = router;