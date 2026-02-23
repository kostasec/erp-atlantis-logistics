// models/Employee.js
const { sql, getPool } = require('../util/db');

class Employee {
  /**
   * Fetch all active employees (from view)
   */
  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT *
      FROM vw_Employee
      WHERE Status = 'Active'
      ORDER BY LastName, FirstName;
    `);
  }

  /**
   * Fetch all active drivers
   */
  static async fetchDrivers() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT EmplID, FirstName, LastName
      FROM Employee
      WHERE EmplType = 'Driver' AND Status = 'Active'
      ORDER BY LastName, FirstName;
    `);
  }

  /**
   * Fetch all managers (Directors)
   */
  static async fetchManagers() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT EmplID, FirstName, LastName 
      FROM Employee 
      WHERE EmplType LIKE '%Director%' AND Status = 'Active'
      ORDER BY LastName, FirstName;
    `);
  }

  /**
   * Find employee by ID
   */
  static async findById(id) {
    const pool = await getPool();
    return pool.request()
      .input('EmplID', sql.Int, parseInt(id, 10))
      .query(`
        SELECT *
        FROM Employee
        WHERE EmplID = @EmplID AND Status = 'Active'
      `);
  }

  /**
   * Find employee by first and last name
   */
  static async findByName(firstName, lastName) {
    const pool = await getPool();
    return pool.request()
      .input('FirstName', sql.VarChar(50), firstName)
      .input('LastName', sql.VarChar(50), lastName)
      .query(`
        SELECT *
        FROM Employee
        WHERE FirstName = @FirstName 
        AND LastName = @LastName 
        AND Status = 'Active'
      `);
  }

  /**
   * Insert new employee
   */
  static async insert(employeeDTO, transaction) {
    const result = await new sql.Request(transaction)
      .input('EmplType', sql.VarChar(50), employeeDTO.EmplType)
      .input('FirstName', sql.VarChar(50), employeeDTO.FirstName)
      .input('LastName', sql.VarChar(50), employeeDTO.LastName)
      .input('StreetAndNmbr', sql.VarChar(100), employeeDTO.StreetAndNmbr)
      .input('City', sql.VarChar(50), employeeDTO.City)
      .input('ZIPCode', sql.VarChar(10), employeeDTO.ZIPCode)
      .input('Country', sql.VarChar(50), employeeDTO.Country)
      .input('PhoneNmbr', sql.VarChar(50), employeeDTO.PhoneNmbr)
      .input('EmailAddress', sql.VarChar(50), employeeDTO.EmailAddress)
      .input('IDCardNmbr', sql.VarChar(20), employeeDTO.IDCardNmbr)
      .input('PassportNmbr', sql.VarChar(20), employeeDTO.PassportNmbr)
      .input('MgrID', sql.Int, employeeDTO.MgrID)
      .query(`
        INSERT INTO Employee 
        (EmplType, FirstName, LastName, StreetAndNmbr, City, ZIPCode, Country, 
         PhoneNmbr, EmailAddress, IDCardNmbr, PassportNmbr, MgrID, Status)
        VALUES 
        (@EmplType, @FirstName, @LastName, @StreetAndNmbr, @City, @ZIPCode, @Country, 
         @PhoneNmbr, @EmailAddress, @IDCardNmbr, @PassportNmbr, @MgrID, 'Active');
        
        SELECT SCOPE_IDENTITY() AS EmplID;
      `);

    return result.recordset[0].EmplID;
  }

  /**
   * Update employee
   */
  static async update(id, employeeDTO, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, parseInt(id, 10))
      .input('EmplType', sql.VarChar(50), employeeDTO.EmplType)
      .input('FirstName', sql.VarChar(50), employeeDTO.FirstName)
      .input('LastName', sql.VarChar(50), employeeDTO.LastName)
      .input('StreetAndNmbr', sql.VarChar(100), employeeDTO.StreetAndNmbr)
      .input('City', sql.VarChar(50), employeeDTO.City)
      .input('ZIPCode', sql.VarChar(10), employeeDTO.ZIPCode)
      .input('Country', sql.VarChar(50), employeeDTO.Country)
      .input('PhoneNmbr', sql.VarChar(50), employeeDTO.PhoneNmbr)
      .input('EmailAddress', sql.VarChar(50), employeeDTO.EmailAddress)
      .input('IDCardNmbr', sql.VarChar(20), employeeDTO.IDCardNmbr)
      .input('PassportNmbr', sql.VarChar(20), employeeDTO.PassportNmbr)
      .input('MgrID', sql.Int, employeeDTO.MgrID)
      .query(`
        UPDATE Employee SET
          EmplType = @EmplType,
          FirstName = @FirstName,
          LastName = @LastName,
          StreetAndNmbr = @StreetAndNmbr,
          City = @City,
          ZIPCode = @ZIPCode,
          Country = @Country,
          PhoneNmbr = @PhoneNmbr,
          EmailAddress = @EmailAddress,
          IDCardNmbr = @IDCardNmbr,
          PassportNmbr = @PassportNmbr,
          MgrID = @MgrID
        WHERE EmplID = @EmplID
      `);
  }

  /**
   * Soft delete employee (set Status = 'Inactive')
   */
  static async softDelete(id, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, parseInt(id, 10))
      .query(`
        UPDATE Employee 
        SET Status = 'Inactive' 
        WHERE EmplID = @EmplID
      `);
  }
}

module.exports = Employee;