
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET ORDERS FOR THE LOGGED-IN SELLER
const getSellerOrders = async (req, res) => {
    try {
        const sellerProductIds = await Product.find({
            seller: req.user._id
        }).distinct('_id');

        const orders = await Order.find({
            'items.product': { $in: sellerProductIds }
        })
            .populate('customer', 'name email')
            .populate('items.product', 'name price seller')
            .sort({ createdAt: -1 });

        const sellerOrders = orders
            .map((order) => {
                const sellerItems = order.items.filter((item) => {
                    return (
                        item.product &&
                        item.product.seller &&
                        item.product.seller.toString() ===
                            req.user._id.toString()
                    );
                });

                const sellerTotal = sellerItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );

                return {
                    _id: order._id,
                    customer: order.customer,
                    items: sellerItems,
                    totalAmount: sellerTotal,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt
                };
            })
            .filter((order) => order.items.length > 0);

        return res.status(200).json(sellerOrders);
    } catch (error) {
        console.error('Get seller orders error:', error);
        return res.status(500).json({
            message: 'Unable to fetch seller orders'
        });
    }
};

// UPDATE ORDER STATUS
const updateSellerOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid order status'
            });
        }

        const sellerProductIds = await Product.find({
            seller: req.user._id
        }).distinct('_id');

        const order = await Order.findOne({
            _id: req.params.id,
            'items.product': { $in: sellerProductIds }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found for this seller'
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Update seller order status error:', error);
        return res.status(500).json({
            message: 'Unable to update order status'
        });
    }
};

// CREATE ORDER AT CHECKOUT
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Your cart is empty.'
            });
        }

        const requiredAddressFields = [
            'fullName',
            'streetAddress',
            'city',
            'postalCode',
            'phoneNumber'
        ];

        if (
            !shippingAddress ||
            requiredAddressFields.some(
                (field) =>
                    !String(shippingAddress[field] || '').trim()
            )
        ) {
            return res.status(400).json({
                message: 'Please provide a complete shipping address.'
            });
        }

        const allowedPaymentMethods = [
            'Cash on Delivery',
            'Card / Bank Transfer'
        ];

        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                message: 'Invalid payment method.'
            });
        }

        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const productId =
                item.product || item.productId || item.id;
            const quantity = Number(item.quantity);

            if (
                !productId ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    message: 'Invalid product or quantity.'
                });
            }

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    message: 'A product in your cart could not be found.'
                });
            }

            if (product.stockQuantity < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            orderItems.push({
                product: product._id,
                quantity,
                price: product.price
            });

            subtotal += product.price * quantity;
        }

        // Keep shipping cost consistent with the cart UI.
        const shipping = 400;
        const totalAmount = subtotal + shipping;

        const order = await Order.create({
            customer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'Pending'
        });

        return res.status(201).json({
            message: 'Order placed successfully.',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({
            message: 'Unable to place order.'
        });
    }
};

module.exports = {
    createOrder,
    getSellerOrders,
    updateSellerOrderStatus
};
