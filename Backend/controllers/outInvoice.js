const { sql, getPool } = require('../util/db');
const OutInvoice = require('../models/Invoice/OutInvoice');
const Client = require('../models/Client');
const Composition = require('../models/Vehicle/Composition');
const Vat = require('../models/Invoice/Vat');
const DocumentStatus = require('../models/Status/DocumentStatus');
const ProcessingStatus = require('../models/Status/ProcessingStatus');
const PaymentStatus = require('../models/Status/PaymentStatus');

/**
 * @swagger
 * /outInvoice/read:
 *   get:
 *     summary: Vraća sve izlazne fakture
 *     description: Frontend service metoda - outgoingInvoiceService.getReadInvoice()
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lista izlaznih faktura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       documentStatus:
 *                         type: string
 *                       processingStatus:
 *                         type: string
 *                       dueDate:
 *                         type: string
 *                         format: date
 *                       recipient:
 *                         type: string
 *                       invoiceNumber:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       paymentStatus:
 *                         type: string
 *       500:
 *         description: Greška na serveru
 */
exports.getReadInvoice = async (req, res, next) => {
    try {
        const result = await OutInvoice.fetchAll();

        // Transformacija podataka za frontend format
        const transformedInvoices = result.recordset.map(invoice => {
            return {
               id: invoice.InvoiceNumber, // Jedinstveni identifikator za React key
               documentStatus: invoice.DocumentStatus,
               processingStatus: invoice.ProcessingStatus,
               dueDate: invoice.DueDate,
               recipient: invoice.Recipient,
               invoiceNumber: invoice.InvoiceNumber,
               amount: invoice.TotalInvoiceAmount,
               currency: invoice.Currency,      
               paymentStatus: invoice.PaymentStatusName        
            };
        });

        return res.json({
            success: true,
            data: transformedInvoices
        });

    } catch (err) {
        console.error('Error fetching invoices:', err);
        res.status(500).json({
            success: false,
            message: 'Database Error',
            error: err.message
        });
    }
};

// Render the insert invoice form with lookup data
exports.getInsertInvoice = async (req, res, next) => {
    try {
        const pool = await getPool();
        const [
            clientResult,
            compositionResult,
            vatResult,
            documentStatusResult,
            processingStatusResult,
            paymentStatusResult
       ] = await Promise.all([
            Client.fetchClient(),
            Composition.fetchAll(),
            Vat.fetchAll(),
            DocumentStatus.fetchAll(),
            ProcessingStatus.fetchAll(),
            PaymentStatus.fetchAll()
        ]);
        res.render('outInvoice/insert-outInvoice', {
            pageTitle: 'New Invoice',
            path: '/outInvoice/insert',
            clients: clientResult.recordset,
            compositions: compositionResult.recordset,
            vatReasons: vatResult.recordset,
            documentStatuses: documentStatusResult.recordset,
            processingStatuses: processingStatusResult.recordset,
            paymentStatuses: paymentStatusResult.recordset
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Database error');
    }
};

// Handle creating a new invoice with items
exports.postInsertInvoice = async (req, res, next) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
  try {
    await transaction.begin();
    const insertedOutInvoice = await OutInvoice.insert(req.body, transaction);
    await transaction.commit();
    res.redirect('/outInvoice/read');
  } catch (err) {
  await transaction.rollback();
    console.error('Error inserting invoice with items:', err);
    res.status(500).send('Database Error');
  }

};