const { sql, getPool } = require('../../util/db');

class EmployeeCar {
  static async fetchAll() {
    const pool = await getPool();
    return pool.request()
      .query(`
      SELECT 
          c.CarID,
          c.Make AS CarMake,
          c.Model AS CarModel,
          c.RegistrationTag AS CarRegistrationTag,
          c.Status AS CarStatus
      FROM Car c
      WHERE c.Status = 'Active'
      ORDER BY c.CarID;
      `);
  }

  static async fetchEmployeesByCar(carId) {
    const pool = await getPool();
    return pool.request()
      .input('CarID', sql.Int, carId)
      .query(`
        SELECT 
          ec.ID,
          ec.EmplID,
          e.FirstName,
          e.LastName,
          e.FirstName + ' ' + e.LastName AS FullName
        FROM EmployeeCar ec
        INNER JOIN Employee e ON e.EmplID = ec.EmplID
        WHERE ec.CarID = @CarID AND ec.Status = 'Active'
        ORDER BY e.LastName, e.FirstName
      `);
  }

  /**
   * Fetch all active non-driver employees for car assignment
   */
  static async fetchAvailableEmployees() {
    const pool = await getPool();
    return pool.request()
      .query(`
        SELECT EmplID, FirstName, LastName
        FROM Employee
        WHERE EmplType NOT IN ('Driver') AND Status = 'Active'
        ORDER BY LastName, FirstName
      `);
  }

  static async insert(emplId, carId, transaction) {
    const result = await new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .input('CarID', sql.Int, carId)
      .query(`
        INSERT INTO EmployeeCar(EmplID, CarID, Status)
        VALUES (@EmplID, @CarID, 'Active');
        SELECT SCOPE_IDENTITY() AS ID;
      `);
    return result.recordset[0].ID;
  }

  static async update(emplId, carId, transaction) {
    return new sql.Request(transaction)
      .input('EmplID', sql.Int, emplId)
      .input('CarID', sql.Int, carId)
      .query(`
        UPDATE EmployeeCar
        SET EmplID = @EmplID
        WHERE CarID = @CarID
      `);
  }

  static async delete(employeeCarId, transaction) {
    return new sql.Request(transaction)
      .input('ID', sql.Int, employeeCarId)
      .query(`
        UPDATE EmployeeCar
        SET Status='Inactive'
        WHERE ID = @ID
      `);
  }

}

module.exports = EmployeeCar;