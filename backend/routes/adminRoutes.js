const express = require('express');

const {
    getPendingSellers,
    approveSeller,
    rejectSeller
} = require('../controllers/adminController');

const router = express.Router();

// GET all pending sellers
router.get('/sellers/pending', getPendingSellers);

// Approve a seller
router.put('/sellers/:id/approve', approveSeller);

// Reject a seller
router.put('/sellers/:id/reject', rejectSeller);

module.exports = router;