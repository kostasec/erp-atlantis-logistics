const { sql, getPool } = require('../util/db');
const IncInvoice = require('../models/Invoice/IncInvoice');

/**
 * @swagger
 * /incInvoice/read:
 *   get:
 *     summary: Vraća sve ulazne fakture
 *     description: Frontend service metoda - incomingInvoiceService.getAllIncomingInvoices()
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lista ulaznih faktura
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
 *                       incInvID:
 *                         type: integer
 *                       invoiceNumber:
 *                         type: string
 *                       documentStatus:
 *                         type: string
 *                       processingStatus:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       paymentStatus:
 *                         type: string
 *       500:
 *         description: Greška na serveru
 */
exports.getAllIncomingInvoices = async (req, res, next) => {
    try {
        const result = await IncInvoice.fetchAllIncInv();

        // Transformacija podataka za frontend format
        const transformedInvoices = result.recordset.map(invoice => {   
            return {
                id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
                incInvID: invoice.IncInvID,
                invoiceNumber: invoice.IncInvNmbr,
                documentStatus: invoice.DStatusName,
                processingStatus: invoice.ProcessingStatusName,
                sender: invoice.Sender,
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
            message: 'Database Error'
        });
    }
};

exports.getIncomingInvoiceCarriers = async (req, res, next) => {
    try {
        const result = await IncInvoice.fetchIncInvCarrier();

        // Transformacija podataka za frontend format
        const transformedInvoices = result.recordset.map(invoice => {
            return {
                id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
                incInvID: invoice.IncInvID,
                invoiceNumber: invoice.IncInvNmbr,
                dueDate: invoice.DueDate,
                sender: invoice.Sender,
                amount: invoice.Amount,
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
            message: 'Database Error'
        });
    }
};

exports.getIncomingInvoiceSuppliers = async (req, res, next) => {
    try {
        const result = await IncInvoice.fetchIncInvOther();

        // Transformacija podataka za frontend format
        const transformedInvoices = result.recordset.map(invoice => {
            return {
                id: invoice.InvoiceNmbr, // Jedinstveni identifikator za React key
                incInvID: invoice.IncInvID,
                invoiceNumber: invoice.IncInvNmbr,
                dueDate: invoice.DueDate,
                sender: invoice.Sender,
                amount: invoice.Amount,
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
            message: 'Database Error'
        });
    }
};

