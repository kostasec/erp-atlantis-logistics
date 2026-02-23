const { sql, getPool } = require('../../util/db');

class Truck {
    
  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`SELECT * FROM Truck WHERE Status='Active'`);
  }

  //Vehicles>Add New Vehicles>Truck
  static async insert(reqBody, transaction) {
    const truckResult = await new sql.Request(transaction)
      .input('Make', sql.VarChar, reqBody.TruckMake)
      .input('Model', sql.VarChar, reqBody.TruckModel)
      .input('RegistrationTag', sql.VarChar, reqBody.TruckRegistrationTag)
      .input('Status', sql.VarChar, 'Active')
      .query(`
        INSERT INTO Truck (Make, Model, RegistrationTag, Status)
        VALUES (@Make, @Model, @RegistrationTag, @Status);
        SELECT SCOPE_IDENTITY() AS TruckID;
      `);

    return truckResult.recordset[0].TruckID; 
  }

  static async update(truckId, make, model, registrationTag, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .input('Make', sql.VarChar, make)
      .input('Model', sql.VarChar, model)
      .input('RegistrationTag', sql.VarChar, registrationTag)
      .query(`
        UPDATE Truck
        SET Make = @Make,
            Model = @Model,
            RegistrationTag = @RegistrationTag
        WHERE TruckID = @TruckID
      `);
  }

  static async delete(truckId, transaction) {
    return new sql.Request(transaction)
      .input('TruckID', sql.Int, truckId)
      .query(`
        UPDATE Truck
        SET Status = 'Inactive'
        WHERE TruckID = @TruckID
      `);
  }
}

module.exports = Truck;