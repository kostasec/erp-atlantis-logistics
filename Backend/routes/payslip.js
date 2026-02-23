const express = require('express');
const router = express.Router();
const payslipController = require('../controllers/payslip');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /payslip/grouped - glavna ruta za sve payslip podatke - All authenticated users
router.get('/read/transaction/groupedPayslip', authenticateToken, payslipController.getGroupedPaySlips);

// GET /payslip/transaction/eur - Finance data, All authenticated users
router.get('/read/transaction/eur', authenticateToken, payslipController.getTransactionEUR);

// GET /payslip/transaction/rsd - Finance data, All authenticated users
router.get('/read/transaction/rsd', authenticateToken, payslipController.getTransactionRSD);

// GET /payslip/drivers - Basic info, requires authentication
router.get('/read/drivers', authenticateToken, payslipController.getDriverNames);

module.exports = router;
