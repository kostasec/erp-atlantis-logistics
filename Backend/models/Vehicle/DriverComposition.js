// models/DriverComposition.js
const { sql, getPool } = require('../../util/db');

class DriverComposition {

  static async insert(driverId, compositionId, transaction) {
    const result = await new sql.Request(transaction)
      .input('DriverID', sql.Int, driverId)
      .input('CompositionID', sql.Int, compositionId)
      .query(`
        INSERT INTO DriverComposition(DriverID, CompositionID, Status)
        VALUES (@DriverID, @CompositionID, 'Active');
        SELECT SCOPE_IDENTITY() AS DriverCompID;
      `);
    return result.recordset[0].DriverCompID;
  }

  static async update(driverId, driverCompID, transaction) {
    return new sql.Request(transaction)
      .input('DriverID', sql.Int, driverId)
      .input('DriverCompID', sql.Int, driverCompID)
      .query(`
        UPDATE DriverComposition
        SET DriverID = @DriverID
        WHERE DriverCompID = @DriverCompID
      `);
  }

  static async delete(id, transaction) {
    return new sql.Request(transaction)
      .input('DriverCompID', sql.Int, id)
      .query(`
        UPDATE DriverComposition
        SET Status = 'Inactive'
        WHERE DriverCompID = @DriverCompID
      `);
  }


}

module.exports = DriverComposition;
