
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuthMiddleware');

// Public login
router.post('/login', loginAdmin);

// Register - Protected for superadmins (except first user)
router.post('/register', (req, res, next) => {
    // Check if it's the first admin ever
    const Admin = require('../models/Admin');
    Admin.countDocuments().then(count => {
        if (count === 0) {
            next();
        } else {
            adminAuth(req, res, next);
        }
    });
}, registerAdmin);

module.exports = router;
