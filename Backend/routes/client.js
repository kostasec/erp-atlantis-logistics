// routes/client.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /client
 * Get all clients
 */
router.get('/', clientController.getAllClients);

/**
 * POST /client
 * Create or update client (UPSERT)
 */
router.post('/', clientController.upsertClient);

/**
 * GET /client/:taxId
 * Get client by TaxID
 */
router.get('/:taxId', clientController.getClientByTaxId);

/**
 * DELETE /client/:taxId
 * Delete client (soft delete)
 */
router.delete('/:taxId', clientController.deleteClient);

/**
 * GET /client/by-reg/:regNmbr
 * Get client by Registration Number
 */
router.get('/by-reg/:regNmbr', clientController.getClientByRegNmbr);

/**
 * GET /client/by-name/:clientName
 * Get client by Client Name
 */
router.get('/by-name/:clientName', clientController.getClientByClientName);

/**
 * DELETE /client/contact/:contactPersonId
 * Delete contact person
 */
router.delete('/contact/:contactPersonId', clientController.deleteContact);

module.exports = router;