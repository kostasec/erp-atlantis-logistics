//controllers/payslip.js
const { sql, getPool } = require('../util/db');
const PaySlip = require('../models/PaySlip');

/**
 * @swagger
 * /payslip/drivers:
 *   get:
 *     summary: Get all active driver names
 *     tags: [Payslips]
 *     responses:
 *       200:
 *         description: List of active drivers
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
 *                       emplId:
 *                         type: integer
 *                       firstName:
 *                         type: string
 *       500:
 *         description: Server error
 */
exports.getDriverNames = async (req, res) => {
    try {
        const result = await PaySlip.fetchDriverNames();
        const transformedData = result.recordset.map(driver => ({
            emplId: driver.EmplID,
            firstName: driver.FirstName
        }));
        res.json({
            success: true,
            data: transformedData
        });
    } catch (err) {
        console.error('Error fetching driver names:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching driver names',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /payslip/grouped:
 *   get:
 *     summary: Get grouped payslips with RSD and EUR data combined
 *     tags: [Payslips]
 *     responses:
 *       200:
 *         description: Grouped payslips by employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: Server error
 */
exports.getGroupedPaySlips = async (req, res) => {
    try {
        console.log('Starting getGroupedPaySlips...');
        
        // Fetch both RSD and EUR data
        const [rsdResult, eurResult] = await Promise.all([
            PaySlip.fetchPaySlipRSD(),
            PaySlip.fetchPaySlipEUR()
        ]);

        console.log('RSD Result:', rsdResult);
        console.log('EUR Result:', eurResult);
        console.log('RSD Result recordset length:', rsdResult.recordset?.length || 0);
        console.log('EUR Result recordset length:', eurResult.recordset?.length || 0);
        
        // Debug: Log first RSD record if exists
        if (rsdResult.recordset && rsdResult.recordset.length > 0) {
            console.log('First RSD record:', JSON.stringify(rsdResult.recordset[0], null, 2));
        } else {
            console.log('RSD recordset is empty or undefined');
        }
        
        // Debug: Log first EUR record if exists
        if (eurResult.recordset && eurResult.recordset.length > 0) {
            console.log('First EUR record:', JSON.stringify(eurResult.recordset[0], null, 2));
        } else {
            console.log('EUR recordset is empty or undefined');
        }
        
        // Check if we have any data at all
        if ((!rsdResult.recordset || rsdResult.recordset.length === 0) && 
            (!eurResult.recordset || eurResult.recordset.length === 0)) {
            console.log('No RSD or EUR data found - returning empty object');
            return res.json({
                success: true,
                data: {},
                message: 'No payslip data available'
            });
        }

        // Transform RSD data
        const rsdData = (rsdResult.recordset || []).map(payslip => {
            const transformed = {
                paySlipId: payslip.PaySlip_ID,
                psID: payslip.PsID,
                issueDate: payslip.IssueDate,
                orderNumber: String(payslip.OrderNmbr || ''), // Ensure it's a string
                transactionDate: payslip.TransactionDate,
                allowanceRSD: payslip.Allowance || 0,
                costsRSD: payslip.Costs || 0,
                employee: payslip.Employee || 'Unknown'
            };
            console.log('Transformed RSD:', transformed.orderNumber, 'Employee:', transformed.employee);
            return transformed;
        });

        // Transform EUR data
        const eurData = (eurResult.recordset || []).map(payslip => {
            const transformed = {
                paySlipId: payslip.PaySlip_ID,
                psID: payslip.PsID,
                issueDate: payslip.IssueDate,
                orderNumber: String(payslip.OrderNmbr || ''), // Ensure it's a string
                transactionDate: payslip.TransactionDate,
                allowanceEUR: payslip.Allowance || 0,
                costsEUR: payslip.Costs || 0,
                employee: payslip.Employee || 'Unknown'
            };
            console.log('Transformed EUR:', transformed.orderNumber, 'Employee:', transformed.employee);
            return transformed;
        });

        console.log('RSD Data transformed:', rsdData.length);
        console.log('EUR Data transformed:', eurData.length);

        // Group payslips by employee
        const groupedPaySlips = {};
        
        // Track which EUR payslips have been matched with RSD
        const matchedEurOrders = new Set();
        
        // Process RSD data and match with EUR
        rsdData.forEach(rsdPayslip => {
            // Find matching EUR payslip by orderNumber (string comparison)
            const eurPayslip = eurData.find(
                eur => String(eur.orderNumber) === String(rsdPayslip.orderNumber)
            );
            
            if (eurPayslip) {
                console.log(`Matched order ${rsdPayslip.orderNumber} with EUR data`);
                matchedEurOrders.add(String(eurPayslip.orderNumber));
            } else {
                console.log(`No EUR match found for order ${rsdPayslip.orderNumber}`);
            }
            
            // Initialize employee array if doesn't exist
            if (!groupedPaySlips[rsdPayslip.employee]) {
                groupedPaySlips[rsdPayslip.employee] = [];
            }
            
            // Push combined data
            groupedPaySlips[rsdPayslip.employee].push({
                paySlipId: rsdPayslip.paySlipId,
                psID: rsdPayslip.psID,
                orderNumber: rsdPayslip.orderNumber,
                issueDate: rsdPayslip.issueDate,
                transactionDate: rsdPayslip.transactionDate,
                domesticAllowance: rsdPayslip.allowanceRSD,
                domesticExpenses: rsdPayslip.costsRSD,
                inoAllowance: eurPayslip?.allowanceEUR || 0,
                inoExpenses: eurPayslip?.costsEUR || 0
            });
        });
        
        // Process unmatched EUR data (EUR payslips that don't have corresponding RSD entry)
        eurData.forEach(eurPayslip => {
            if (!matchedEurOrders.has(String(eurPayslip.orderNumber))) {
                console.log(`Processing unmatched EUR order ${eurPayslip.orderNumber}`);
                
                // Initialize employee array if doesn't exist
                if (!groupedPaySlips[eurPayslip.employee]) {
                    groupedPaySlips[eurPayslip.employee] = [];
                }
                
                // Push EUR-only data
                groupedPaySlips[eurPayslip.employee].push({
                    paySlipId: eurPayslip.paySlipId,
                    psID: eurPayslip.psID,
                    orderNumber: eurPayslip.orderNumber,
                    issueDate: eurPayslip.issueDate,
                    transactionDate: eurPayslip.transactionDate,
                    domesticAllowance: 0,
                    domesticExpenses: 0,
                    inoAllowance: eurPayslip.allowanceEUR,
                    inoExpenses: eurPayslip.costsEUR
                });
            }
        });

        console.log('Grouped payslips keys:', Object.keys(groupedPaySlips));
        console.log('Grouped payslips:', JSON.stringify(groupedPaySlips, null, 2));

        res.json({
            success: true,
            data: groupedPaySlips
        });
    } catch (err) {
        console.error('Error fetching grouped payslips:', err);
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            number: err.number,
            state: err.state,
            class: err.class,
            lineNumber: err.lineNumber,
            serverName: err.serverName,
            procName: err.procName
        });
        res.status(500).json({
            success: false,
            message: 'Error fetching grouped payslips',
            error: err.message,
            details: err.number ? `SQL Error ${err.number}` : 'Unknown error'
        });
    }
};


/**
 * @swagger
 * /payslip/transaction/eur:
 *   get:
 *     summary: Get all EUR transactions
 *     tags: [Payslips]
 *     responses:
 *       200:
 *         description: List of EUR payment transactions
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
 *                       paymentId:
 *                         type: integer
 *                       amountEUR:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date
 *                       employee:
 *                         type: string
 *       500:
 *         description: Server error
 */
exports.getTransactionEUR = async (req, res) => {
    try {
        const result = await PaySlip.fetchTransactionEUR();
        const transformedData = result.recordset.map(transaction => ({
            paymentId: transaction.PaymentID_EUR,
            amountEUR: transaction.AmountEUR,
            date: transaction.Date,
            employee: transaction.Employee
        }));
        res.json({
            success: true,
            data: transformedData
        });
    } catch (err) {
        console.error('Error fetching EUR transactions:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching EUR transactions',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /payslip/transaction/rsd:
 *   get:
 *     summary: Get all RSD transactions
 *     tags: [Payslips]
 *     responses:
 *       200:
 *         description: List of RSD payment transactions
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
 *       500:
 *         description: Server error
 */
exports.getTransactionRSD = async (req, res) => {
    try {
        const result = await PaySlip.fetchTransactionRSD();
        const transformedData = result.recordset.map(transaction => ({
            paymentId: transaction.PaymentID_RSD,
            amountRSD: transaction.AmountRSD,
            date: transaction.Date
        }));
        res.json({
            success: true,
            data: transformedData
        });
    } catch (err) {
        console.error('Error fetching RSD transactions:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching RSD transactions',
            error: err.message
        });
    }
};
