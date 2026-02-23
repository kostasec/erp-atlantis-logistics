const express = require('express');
const router = express.Router();

const incInvoiceController = require('../controllers/incInvoice');
const { authenticateToken } = require('../middleware/auth');

// GET /incInvoice/read - All authenticated users
router.get('/read', authenticateToken, incInvoiceController.getAllIncomingInvoices);
router.get('/read/IncInvCarrier', authenticateToken, incInvoiceController.getIncomingInvoiceCarriers);
router.get('/read/IncInvOther', authenticateToken, incInvoiceController.getIncomingInvoiceSuppliers);


module.exports = router;