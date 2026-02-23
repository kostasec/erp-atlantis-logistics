const { sql, getPool } = require('../../util/db');

//fetcAllCar za izlistavanje na kartici Vehciles>Car
class Car {
  //Vehicles>Add New Vehicles>Car
  static async insert(carId, make, model, registrationTag, transaction) {
    return new sql.Request(transaction)
      .input('Make', sql.VarChar, make)
      .input('Model', sql.VarChar, model)
      .input('RegistrationTag', sql.VarChar, registrationTag)
      .query(`
        INSERT INTO Car(Make, Model, RegistrationTag, Status)
        VALUES (@Make, @Model, @RegistrationTag, 'Active');
        SELECT SCOPE_IDENTITY() AS CarID;
      `);
  }

  static async update(carId, make, model, registrationTag, transaction) {
    return new sql.Request(transaction)
      .input('CarID', sql.Int, carId)
      .input('Make', sql.VarChar, make)
      .input('Model', sql.VarChar, model)
      .input('RegistrationTag', sql.VarChar, registrationTag)
      .query(`
        UPDATE Car
        SET Make = @Make, Model = @Model, RegistrationTag = @RegistrationTag
        WHERE CarID = @CarID
      `);
  }

    static async delete(carId, transaction){
        return new sql.Request(transaction)
        .input('CarID', sql.Int, carId)
        .query(`
                UPDATE Car
                SET Status='Inactive'
                WHERE CarID=@CarID
            `);
        }
    }
    

module.exports = Car;