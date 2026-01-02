
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuthMiddleware');
const { addClient, updateClient, deleteClient, getClients } = require('../controllers/clientController');

router.use(adminAuth);

router.post('/', addClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/', getClients);

module.exports = router;
