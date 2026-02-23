const express = require('express');
const router = express.Router();

const outInvoiceController = require('../controllers/outInvoice');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /outInvoice/read - Requires authentication
router.get('/read', authenticateToken, outInvoiceController.getReadInvoice);

// GET /outInvoice/insert - All authenticated users
router.get('/insert', authenticateToken, outInvoiceController.getInsertInvoice);

// POST /outInvoice/insert - All authenticated users
router.post('/insert', authenticateToken, outInvoiceController.postInsertInvoice);

module.exports = router;
