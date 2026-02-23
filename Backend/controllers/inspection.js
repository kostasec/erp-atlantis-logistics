//controllers/Inspection.js
const { sql, getPool } = require('../util/db');
const Inspection = require('../models/Inspection');

/**
 * @swagger
 * /inspection/vehicle:
 *   get:
 *     summary: Vraća sve inspekcije vozila
 *     description: Frontend service metoda - inspectionService.getVehicleInspections()
 *     tags: [Inspections]
 *     responses:
 *       200:
 *         description: Lista inspekcija vozila
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
 *                         description: Jedinstveni identifikator (RegistrationTag-Name)
 *                       registrationTag:
 *                         type: string
 *                         description: Registarska tablica vozila
 *                       name:
 *                         type: string
 *                         description: Naziv inspekcije
 *                       oldDate:
 *                         type: string
 *                         format: date
 *                         description: Stari datum inspekcije
 *                       newDate:
 *                         type: string
 *                         format: date
 *                         description: Novi datum inspekcije
 *       500:
 *         description: Greška na serveru
 */
exports.getVehicleInspection = async (req, res, next) => {
    try {
        const result = await Inspection.fetchVehicleInspection();

        const transformedInspections = result.recordset.map(inspection => ({
            id: `${inspection.RegistrationTag}-${inspection.Name}`,
            registrationTag: inspection.RegistrationTag,
            name: inspection.Name,
            oldDate: inspection.OldDate,
            newDate: inspection.NewDate
        }));

        return res.json({
            success: true,
            data: transformedInspections
        });

    } catch (err) {
        console.error('Error fetching vehicle inspections:', err);
        res.status(500).json({
            success: false,
            message: 'Database Error'
        });
    }
    
};

/**
 * @swagger
 * /inspection/employee:
 *   get:
 *     summary: Vraća sve inspekcije zaposlenih
 *     description: Frontend service metoda - inspectionService.getEmployeeInspections()
 *     tags: [Inspections]
 *     responses:
 *       200:
 *         description: Lista inspekcija zaposlenih
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
 *                         description: Jedinstveni identifikator (EmployeeID-Name)
 *                       employeeId:
 *                         type: integer
 *                         description: ID zaposlenog
 *                       employeeName:
 *                         type: string
 *                         description: Ime i prezime zaposlenog
 *                       name:
 *                         type: string
 *                         description: Naziv inspekcije
 *                       oldDate:
 *                         type: string
 *                         format: date
 *                         description: Stari datum inspekcije
 *                       newDate:
 *                         type: string
 *                         format: date
 *                         description: Novi datum inspekcije
 *       500:
 *         description: Greška na serveru
 */
exports.getEmployeeInspection = async (req, res, next) => {
    try {
        const result = await Inspection.fetchEmployeeInspection();

        const transformedInspections = result.recordset.map(inspection => ({
            id: `${inspection.Employee}-${inspection.Name}`,
            employeeName: inspection.Employee,
            name: inspection.Name,
            oldDate: inspection.OldDate,
            newDate: inspection.NewDate
        }));

        return res.json({
            success: true,
            data: transformedInspections
        });

    } catch (err) {
        console.error('Error fetching employee inspections:', err);
        res.status(500).json({
            success: false,
            message: 'Database Error'
        });
    }
};

/**
 * @swagger
 * /inspection/other:
 *   get:
 *     summary: Vraća ostale inspekcije
 *     description: Frontend service metoda - inspectionService.getOtherInspections()
 *     tags: [Inspections]
 *     responses:
 *       200:
 *         description: Lista ostalih inspekcija
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
 *                         type: integer
 *                         description: Jedinstveni identifikator inspekcije
 *                       inspectionId:
 *                         type: integer
 *                         description: ID inspekcije
 *                       name:
 *                         type: string
 *                         description: Naziv inspekcije
 *                       oldDate:
 *                         type: string
 *                         format: date
 *                         description: Stari datum inspekcije
 *                       newDate:
 *                         type: string
 *                         format: date
 *                         description: Novi datum inspekcije
 *       500:
 *         description: Greška na serveru
 */
exports.getInspectionOther = async (req, res, next) => {
    try {
        const result = await Inspection.fetchInspectionOther();

        const transformedInspections = result.recordset.map(inspection => ({
            id: inspection.InspectionID,
            inspectionId: inspection.InspectionID,
            name: inspection.Name,
            oldDate: inspection.OldDate,
            newDate: inspection.NewDate
        }));

        return res.json({
            success: true,
            data: transformedInspections
        });

    } catch (err) {
        console.error('Error fetching other inspections:', err);
        res.status(500).json({
            success: false,
            message: 'Database Error'
        });
    }
};