
const express = require('express');
const router = express.Router();
const { registerBroker, loginBroker } = require('../controllers/authController');

router.post('/register', registerBroker);
router.post('/login', loginBroker);

module.exports = router;
