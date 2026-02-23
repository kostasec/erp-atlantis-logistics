// controllers/EmployeeController.js
const EmployeeService = require('../services/EmployeeService');

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: Get all active employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of employees
 *       500:
 *         description: Server error
 */
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeService.getAllEmployees();
    
    res.json({
      success: true,
      data: employees
    });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

/**
 * @swagger
 * /employee/drivers:
 *   get:
 *     summary: Get all active drivers
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of drivers
 *       500:
 *         description: Server error
 */
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await EmployeeService.getDrivers();
    
    res.json({
      success: true,
      data: drivers
    });
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers'
    });
  }
};

/**
 * @swagger
 * /employee/managers:
 *   get:
 *     summary: Get all active managers
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of managers
 *       500:
 *         description: Server error
 */
exports.getManagers = async (req, res) => {
  try {
    const managers = await EmployeeService.getManagers();
    
    res.json({
      success: true,
      data: managers
    });
  } catch (err) {
    console.error('Error fetching managers:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch managers'
    });
  }
};

/**
 * @swagger
 * /employee/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee found
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeService.getEmployeeById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee'
    });
  }
};

/**
 * @swagger
 * /employee/by-name/{fullName}:
 *   get:
 *     summary: Get employee by full name
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: fullName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee found
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
exports.getEmployeeByName = async (req, res) => {
  try {
    const { fullName } = req.params;
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must include first and last name'
      });
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    const employee = await EmployeeService.getEmployeeByName(firstName, lastName);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error('Error fetching employee by name:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee'
    });
  }
};

/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Create new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Employee created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
exports.createEmployee = async (req, res) => {
  try {
    const employee = await EmployeeService.createEmployee(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (err) {
    console.error('Error creating employee:', err);

    // Handle validation errors
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
        errors: err.errors
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Failed to create employee'
    });
  }
};

/**
 * @swagger
 * /employee/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Employee updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeService.updateEmployee(id, req.body);
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (err) {
    console.error('Error updating employee:', err);

    // Handle validation errors
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
        errors: err.errors
      });
    }

    // Handle not found
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
};

/**
 * @swagger
 * /employee/{id}:
 *   delete:
 *     summary: Delete employee (soft delete)
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmployeeService.deleteEmployee(id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Error deleting employee:', err);

    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
};