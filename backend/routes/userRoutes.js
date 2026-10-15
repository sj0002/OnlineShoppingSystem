const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUsers, requestSeller } = require('../controllers/userController');

const router = express.Router();

router.put('/request-seller', protect, requestSeller);
router.get('/', protect, getUsers);

module.exports = router;