// services/EmployeeService.js
const { sql, getPool } = require('../util/db');
const Employee = require('../models/Employee');
const EmployeeDTO = require('../dto/EmployeeDTO');

class EmployeeService {
  /**
   * Transform database employee to frontend format
   */
  static transformEmployeeToFrontend(employee, manager = null, vehicle = null) {
    return {
      employeeId: employee.EmplID,
      employeeType: employee.EmplType,
      firstName: employee.FirstName,
      lastName: employee.LastName,
      fullName: `${employee.FirstName} ${employee.LastName}`,
      status: employee.Status,
      streetAndNumber: employee.StreetAndNmbr,
      city: employee.City,
      zipCode: employee.ZIPCode,
      country: employee.Country,
      address: `${employee.StreetAndNmbr}, ${employee.City} ${employee.ZIPCode}, ${employee.Country}`,
      phoneNumber: employee.PhoneNmbr,
      emailAddress: employee.EmailAddress,
      idCardNumber: employee.IDCardNmbr,
      passportNumber: employee.PassportNmbr,
      managerId: employee.MgrID,
      manager: manager || employee.Manager || null,
      vehicle: vehicle || employee.Vehicle || null
    };
  }

  /**
   * Get all active employees
   */
  static async getAllEmployees() {
    const result = await Employee.fetchAll();
    
    return result.recordset.map(emp => 
      this.transformEmployeeToFrontend(emp)
    );
  }

  /**
   * Get employees by type (e.g., 'Driver')
   */
  static async getEmployeesByType(type) {
    const result = await Employee.fetchAll();
    const filtered = result.recordset.filter(emp => 
      emp.EmplType === type && emp.Status === 'Active'
    );
    
    return filtered.map(emp => 
      this.transformEmployeeToFrontend(emp)
    );
  }

  /**
   * Get all drivers
   */
  static async getDrivers() {
    const result = await Employee.fetchDrivers();
    
    return result.recordset.map(driver => ({
      employeeId: driver.EmplID,
      firstName: driver.FirstName,
      lastName: driver.LastName,
      fullName: `${driver.FirstName} ${driver.LastName}`
    }));
  }

  /**
   * Get all managers
   */
  static async getManagers() {
    const result = await Employee.fetchManagers();
    
    return result.recordset.map(manager => ({
      employeeId: manager.EmplID,
      firstName: manager.FirstName,
      lastName: manager.LastName,
      fullName: `${manager.FirstName} ${manager.LastName}`
    }));
  }

  /**
   * Get employee by ID
   */
  static async getEmployeeById(id) {
    const result = await Employee.findById(id);
    
    if (result.recordset.length === 0) {
      return null;
    }

    return this.transformEmployeeToFrontend(result.recordset[0]);
  }

  /**
   * Get employee by first and last name
   */
  static async getEmployeeByName(firstName, lastName) {
    const result = await Employee.findByName(firstName, lastName);
    
    if (result.recordset.length === 0) {
      return null;
    }

    return this.transformEmployeeToFrontend(result.recordset[0]);
  }

  /**
   * Create new employee
   */
  static async createEmployee(data) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      // Create DTO and validate
      const employeeDTO = new EmployeeDTO(data);
      const validationErrors = employeeDTO.validate();

      if (validationErrors.length > 0) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validationErrors
        };
      }
      // Check if manager exists (if MgrID provided)
      if (employeeDTO.MgrID) {
        // Use pool directly to check without Status filter
        const pool = await getPool();
        const managerCheck = await pool.request()
          .input('MgrID', sql.Int, employeeDTO.MgrID)
          .query('SELECT EmplID FROM Employee WHERE EmplID = @MgrID');
          
        if (managerCheck.recordset.length === 0) {
          throw {
            status: 400,
            message: 'Manager not found'
          };
        }
      }

      // Start transaction
      await transaction.begin();

      // Insert employee
      const insertedEmployeeID = await Employee.insert(employeeDTO, transaction);

      // Commit transaction
      await transaction.commit();

      // Return created employee
      return await this.getEmployeeById(insertedEmployeeID);

    } catch (err) {
      if (transaction && transaction._aborted !== true) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  /**
   * Update employee
   */
  static async updateEmployee(id, data) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      // Check if employee exists
      const existing = await Employee.findById(id);
      if (existing.recordset.length === 0) {
        throw {
          status: 404,
          message: 'Employee not found'
        };
      }

      // Create DTO and validate
      const employeeDTO = new EmployeeDTO({ ...data, EmplID: id });
      const validationErrors = employeeDTO.validate();

      if (validationErrors.length > 0) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Check if manager exists (if MgrID provided)
      if (employeeDTO.MgrID) {
        const managerExists = await Employee.findById(employeeDTO.MgrID);
        if (managerExists.recordset.length === 0) {
          throw {
            status: 400,
            message: 'Manager not found'
          };
        }
      }

      // Start transaction
      await transaction.begin();

      // Update employee
      await Employee.update(id, employeeDTO, transaction);

      // Commit transaction
      await transaction.commit();

      // Return updated employee
      return await this.getEmployeeById(id);

    } catch (err) {
      // Log detailed error BEFORE attempting rollback
      console.error('!!! ERROR DETAILS !!!');
      console.error('Error type:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error stack:', err.stack);
      console.error('Transaction state:', transaction?._aborted, transaction?._begun);
      
      // Only rollback if transaction was started
      if (transaction && transaction._begun && !transaction._aborted) {
        try {
          await transaction.rollback();
        } catch (rollbackErr) {
          console.error('Rollback failed:', rollbackErr);
        }
      }
      throw err;
    }
  }

  /**
   * Delete employee (soft delete)
   */
  static async deleteEmployee(id) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      // Check if employee exists
      const employee = await Employee.findById(id);
      if (employee.recordset.length === 0) {
        throw {
          status: 404,
          message: 'Employee not found'
        };
      }

      await transaction.begin();

      // Soft delete (Status = 'Inactive')
      await Employee.softDelete(id, transaction);

      await transaction.commit();

      return { success: true, message: 'Employee deleted successfully' };
    } catch (err) {
      if (transaction && transaction._aborted !== true) {
        await transaction.rollback();
      }
      throw err;
    }
  }
}

module.exports = EmployeeService;