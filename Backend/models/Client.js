// models/Client.js
const { sql, getPool } = require('../util/db');

class Client {
  /**
   * Fetch all clients with contacts (from view)
   */
  static async fetchAll() {
    const pool = await getPool();
    return pool.request().query(`
      SELECT *
      FROM vw_ClientWithContacts
      WHERE IsActive = 1
      ORDER BY ClientName;
    `);
  }

  /**
   * Find client by TaxID
   */
  static async findClientByTaxId(taxId) {
    const pool = await getPool();
    return pool.request()
      .input('TaxID', sql.VarChar(50), taxId)
      .query(`
        SELECT *
        FROM Client
        WHERE TaxID = @TaxID 
        AND IsActive = 1;
      `);
  }

  /**
   * Find client by Registration Number
   */
  static async findClientByRegNmbr(regNmbr) {
    const pool = await getPool();
    return pool.request()
      .input('RegNmbr', sql.VarChar(30), regNmbr)
      .query(`
        SELECT *
        FROM Client
        WHERE RegNmbr = @RegNmbr
        AND IsActive = 1;
      `);
  }

  /**
   * Find client by Client Name
   */
  static async findClientByClientName(clientName) {
    const pool = await getPool();
    return pool.request()
      .input('ClientName', sql.VarChar(100), clientName)
      .query(`
        SELECT *
        FROM Client
        WHERE ClientName = @ClientName
        AND IsActive = 1;
      `);
  }

  /**
   * Find contacts by TaxID
   */
  static async findContactsByTaxId(taxId) {
    const pool = await getPool();
    return pool.request()
      .input('TaxID', sql.VarChar(50), taxId)
      .query(`
        SELECT ContactPersonID, ContactName, [Description], PhoneNmbr, PersonEmail
        FROM ContactPerson
        WHERE TaxID = @TaxID
        ORDER BY ContactPersonID;
      `);
  }

  /**
   * Insert or update client with contacts
   */
  static async upsert(clientDTO, transaction) {
    try {
      // Check if client exists
      const clientExists = await new sql.Request(transaction)
        .input('TaxID', sql.VarChar(50), clientDTO.TaxID)
        .query('SELECT COUNT(1) AS Cnt FROM dbo.Client WHERE TaxID = @TaxID');

      if (clientExists.recordset[0].Cnt > 0) {
        // UPDATE existing client
        await new sql.Request(transaction)
          .input('TaxID', sql.VarChar(50), clientDTO.TaxID)
          .input('RegNmbr', sql.VarChar(30), clientDTO.RegNmbr)
          .input('ClientName', sql.VarChar(100), clientDTO.ClientName)
          .input('StreetAndNmbr', sql.VarChar(100), clientDTO.StreetAndNmbr)
          .input('City', sql.VarChar(50), clientDTO.City)
          .input('ZIP', sql.VarChar(10), clientDTO.ZIP)
          .input('Country', sql.VarChar(50), clientDTO.Country)
          .input('Email', sql.VarChar(100), clientDTO.Email)
          .input('ClientType', sql.VarChar(10), clientDTO.ClientType)
          .query(`
            UPDATE dbo.Client
            SET RegNmbr = @RegNmbr,
                ClientName = @ClientName,
                StreetAndNmbr = @StreetAndNmbr,
                City = @City,
                ZIP = @ZIP,
                Country = @Country,
                Email = @Email,
                ClientType = @ClientType,
                IsActive = 1
            WHERE TaxID = @TaxID
          `);
      } else {
        // INSERT new client
        await new sql.Request(transaction)
          .input('TaxID', sql.VarChar(50), clientDTO.TaxID)
          .input('RegNmbr', sql.VarChar(30), clientDTO.RegNmbr)
          .input('ClientName', sql.VarChar(100), clientDTO.ClientName)
          .input('StreetAndNmbr', sql.VarChar(100), clientDTO.StreetAndNmbr)
          .input('City', sql.VarChar(50), clientDTO.City)
          .input('ZIP', sql.VarChar(10), clientDTO.ZIP)
          .input('Country', sql.VarChar(50), clientDTO.Country)
          .input('Email', sql.VarChar(100), clientDTO.Email)
          .input('ClientType', sql.VarChar(10), clientDTO.ClientType)
          .query(`
            INSERT INTO dbo.Client (TaxID, RegNmbr, ClientName, StreetAndNmbr, City, ZIP, Country, Email, ClientType, IsActive)
            VALUES (@TaxID, @RegNmbr, @ClientName, @StreetAndNmbr, @City, @ZIP, @Country, @Email, @ClientType, 1)
          `);
      }

      // Handle contacts
      for (const contact of clientDTO.contacts) {
        if (contact.ContactPersonID) {
          // UPDATE existing contact
          await new sql.Request(transaction)
            .input('ContactPersonID', sql.Int, parseInt(contact.ContactPersonID))
            .input('ContactName', sql.VarChar(100), contact.ContactName)
            .input('Description', sql.VarChar(200), contact.Description)
            .input('PhoneNmbr', sql.VarChar(50), contact.PhoneNmbr)
            .input('PersonEmail', sql.VarChar(100), contact.PersonEmail)
            .input('TaxID', sql.VarChar(50), clientDTO.TaxID)
            .query(`
              UPDATE dbo.ContactPerson
              SET ContactName = @ContactName,
                  [Description] = @Description,
                  PhoneNmbr = @PhoneNmbr,
                  PersonEmail = @PersonEmail
              WHERE ContactPersonID = @ContactPersonID AND TaxID = @TaxID
            `);
        } else {
          // INSERT new contact
          await new sql.Request(transaction)
            .input('TaxID', sql.VarChar(50), clientDTO.TaxID)
            .input('ContactName', sql.VarChar(100), contact.ContactName)
            .input('Description', sql.VarChar(200), contact.Description)
            .input('PhoneNmbr', sql.VarChar(50), contact.PhoneNmbr)
            .input('PersonEmail', sql.VarChar(100), contact.PersonEmail)
            .query(`
              INSERT INTO dbo.ContactPerson (TaxID, ContactName, [Description], PhoneNmbr, PersonEmail)
              VALUES (@TaxID, @ContactName, @Description, @PhoneNmbr, @PersonEmail)
            `);
        }
      }
    } catch (error) {
      console.error('Error in Client.upsert:', error);
      throw error;
    }
  }

  /**
   * Soft delete client (set IsActive = 0)
   */
  static async deleteClient(taxId, transaction) {
    return new sql.Request(transaction)
      .input('TaxID', sql.VarChar(50), taxId)
      .query(`
        UPDATE dbo.Client 
        SET IsActive = 0
        WHERE TaxID = @TaxID
      `);
  }

  /**
   * Delete contact person (hard delete due to CASCADE)
   */
  static async deleteContact(contactPersonId, transaction) {
    return new sql.Request(transaction)
      .input('ContactPersonID', sql.Int, parseInt(contactPersonId))
      .query(`
        DELETE FROM dbo.ContactPerson
        WHERE ContactPersonID = @ContactPersonID
      `);
  }
}

module.exports = Client;