// controllers/ClientController.js
const ClientService = require('../services/ClientService');

/**
 * @swagger
 * /client:
 *   get:
 *     summary: Get all clients with contacts
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients
 *       500:
 *         description: Server error
 */
exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientService.getAllClients();
    
    res.json({
      success: true,
      data: clients
    });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients'
    });
  }
};

/**
 * @swagger
 * /client/{taxId}:
 *   get:
 *     summary: Get client by Tax ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: taxId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client found
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
exports.getClientByTaxId = async (req, res) => {
  try {
    const { taxId } = req.params;
    const client = await ClientService.getClientByTaxId(taxId.trim());
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client'
    });
  }
};

/**
 * @swagger
 * /client/by-reg/{regNmbr}:
 *   get:
 *     summary: Get client by Registration Number
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: regNmbr
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client found
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
exports.getClientByRegNmbr = async (req, res) => {
  try {
    const { regNmbr } = req.params;
    const client = await ClientService.getClientByRegNmbr(regNmbr.trim());
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client'
    });
  }
};

/**
 * @swagger
 * /client/by-name/{clientName}:
 *   get:
 *     summary: Get client by Client Name
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client found
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
exports.getClientByClientName = async (req, res) => {
  try {
    const { clientName } = req.params;
    const client = await ClientService.getClientByClientName(clientName.trim());
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client'
    });
  }
};

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Create or update client (UPSERT)
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Client created/updated
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate entry
 *       500:
 *         description: Server error
 */
exports.upsertClient = async (req, res) => {
  try {
    const client = await ClientService.upsertClient(req.body);
    
    res.json({
      success: true,
      message: 'Client saved successfully',
      data: client
    });
  } catch (err) {
    console.error('Error upserting client:', err);

    // Handle validation errors
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
        errors: err.errors
      });
    }

    // Handle duplicate errors
    if (err.status === 409) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Failed to save client'
    });
  }
};

/**
 * @swagger
 * /client/{taxId}:
 *   delete:
 *     summary: Delete client (soft delete)
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: taxId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
exports.deleteClient = async (req, res) => {
  try {
    const { taxId } = req.params;
    const result = await ClientService.deleteClient(taxId.trim());
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Error deleting client:', err);

    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete client'
    });
  }
};

/**
 * @swagger
 * /client/contact/{contactPersonId}:
 *   delete:
 *     summary: Delete contact person
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: contactPersonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted
 *       500:
 *         description: Server error
 */
exports.deleteContact = async (req, res) => {
  try {
    const { contactPersonId } = req.params;
    const result = await ClientService.deleteContact(parseInt(contactPersonId));
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};