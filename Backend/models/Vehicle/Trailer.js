const { sql, getPool } = require('../../util/db');

class Trailer {
    
  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`SELECT * FROM Trailer WHERE Status='Active'`);
  }

  //Vehicles>Add New Vehicles>Trailer
  static async insert(reqBody, transaction) {
    const trailerResult = await new sql.Request(transaction)
      .input('Make', sql.VarChar, reqBody.TrailerMake)
      .input('Model', sql.VarChar, reqBody.TrailerModel)
      .input('RegistrationTag', sql.VarChar, reqBody.TrailerRegistrationTag)
      .input('Status', sql.VarChar, 'Active')
      .query(`
        INSERT INTO Trailer (Make, Model, RegistrationTag, Status)
        VALUES (@Make, @Model, @RegistrationTag, @Status);
        SELECT SCOPE_IDENTITY() AS TrailerID;
      `);

    return trailerResult.recordset[0].TrailerID; 
  }

  static async update(trailerId, make, model, registrationTag, transaction) {
    return new sql.Request(transaction)
      .input('TrailerID', sql.Int, trailerId)
      .input('Make', sql.VarChar, make)
      .input('Model', sql.VarChar, model)
      .input('RegistrationTag', sql.VarChar, registrationTag)
      .query(`
        UPDATE Trailer
        SET Make = @Make,
            Model = @Model,
            RegistrationTag = @RegistrationTag
        WHERE TrailerID = @TrailerID
      `);
  }

  static async delete(trailerId, transaction) {
    return new sql.Request(transaction)
      .input('TrailerID', sql.Int, trailerId)
      .query(`
        UPDATE Trailer
        SET Status = 'Inactive'
        WHERE TrailerID = @TrailerID
      `);
  }
}

module.exports = Trailer;