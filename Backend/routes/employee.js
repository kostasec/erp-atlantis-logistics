// routes/employee.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /employee
 * Get all active employees
 */
router.get('/', employeeController.getAllEmployees);

/**
 * POST /employee
 * Create new employee
 */
router.post('/', employeeController.createEmployee);

/**
 * GET /employee/drivers
 * Get all active drivers
 */
router.get('/drivers', employeeController.getDrivers);

/**
 * GET /employee/managers
 * Get all active managers
 */
router.get('/managers', employeeController.getManagers);

/**
 * GET /employee/:id
 * Get employee by ID
 */
router.get('/:id', employeeController.getEmployeeById);

/**
 * PUT /employee/:id
 * Update employee
 */
router.put('/:id', employeeController.updateEmployee);

/**
 * DELETE /employee/:id
 * Delete employee (soft delete)
 */
router.delete('/:id', employeeController.deleteEmployee);

/**
 * GET /employee/by-name/:fullName
 * Get employee by full name (firstName lastName)
 */
router.get('/by-name/:fullName', employeeController.getEmployeeByName);

module.exports = router;