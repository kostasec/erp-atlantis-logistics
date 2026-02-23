const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspection');
const { authenticateToken } = require('../middleware/auth');

// GET /inspection/read/vehicleInspection - All authenticated users
router.get('/read/vehicleInspection', authenticateToken, inspectionController.getVehicleInspection);

// GET /inspection/read/employeeInspection - All authenticated users
router.get('/read/employeeInspection', authenticateToken, inspectionController.getEmployeeInspection);

// GET /inspection/read/InspectionOthrt - All authenticated users
router.get('/read/inspectionOther', authenticateToken, inspectionController.getInspectionOther);

module.exports = router;
