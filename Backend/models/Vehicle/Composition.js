const { sql, getPool } = require('../../util/db');

class Composition {

  static async fetchCompositionDetails() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT 
          c.CompositionID,
          c.TruckID,
          c.TrailerID,
          t.Make AS TruckMake,
          t.Model AS TruckModel,
          t.Status AS TruckStatus,
          tr.Make AS TrailerMake,
          tr.Model AS TrailerModel,
          tr.Status AS TrailerStatus,
          t.RegistrationTag AS TruckRegistrationTag,
          tr.RegistrationTag AS TrailerRegistrationTag,
          dc.DriverCompID,
          dc.DriverID,
          CASE 
              WHEN dc.Status = 'Active' THEN e.FirstName + ' ' + e.LastName
              ELSE NULL
          END AS Driver,
          c.Status AS CompositionStatus,
          dc.Status AS DriverCompStatus
      FROM Composition c
      LEFT JOIN Truck t ON t.TruckID = c.TruckID
      LEFT JOIN Trailer tr ON tr.TrailerID = c.TrailerID
      LEFT JOIN DriverComposition dc ON dc.CompositionID = c.CompositionID
      LEFT JOIN Employee e ON e.EmplID = dc.DriverID
      WHERE c.Status = 'Active'
      ORDER BY c.CompositionID, dc.Status DESC
    `);
  }

  //insertComposition za dodavanje nove kompozicije, Vehicle>Add new Vehicle>svi tipovi vozila osim Car
  static async insert(truckId, trailerId, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        INSERT INTO Composition (TruckID, TrailerID, Status)
        VALUES (@TruckID, @TrailerID, 'Active');
        SELECT SCOPE_IDENTITY() AS CompositionID;
      `);
  }

  static async updateTruck(compositionId, newTruckId, transaction) {
    return new sql.Request(transaction)
      .input('CompositionID', sql.Int, compositionId)
      .input('TruckID', sql.Int, newTruckId)
      .query(`
        UPDATE Composition
        SET TruckID = @TruckID
        WHERE CompositionID = @CompositionID
      `);
  }

  static async updateTrailer(compositionId, newTrailerId, transaction) {
    return new sql.Request(transaction)
      .input('CompositionID', sql.Int, compositionId)
      .input('TrailerID', sql.Int, newTrailerId)
      .query(`
        UPDATE Composition
        SET TrailerID = @TrailerID
        WHERE CompositionID = @CompositionID
      `);
  }

  static async delete(compositionId, transaction) {
    return new sql.Request(transaction)
      .input('CompositionID', sql.Int, compositionId)
      .query(`
        UPDATE Composition
        SET Status = 'Inactive'
        WHERE CompositionID = @CompositionID
      `);
  }

}

module.exports = Composition;