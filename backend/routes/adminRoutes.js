const express = require('express');

const {
    getReportSummary,
    getPendingSellers,
    approveSeller,
    rejectSeller
} = require('../controllers/adminController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/reports/summary', protect, getReportSummary);

// GET all pending sellers
router.get('/sellers/pending', getPendingSellers);

// Approve a seller
router.put('/sellers/:id/approve', approveSeller);

// Reject a seller
router.put('/sellers/:id/reject', rejectSeller);

module.exports = router;