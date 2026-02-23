// services/ClientService.js
const { sql, getPool } = require('../util/db');
const Client = require('../models/Client');
const { ClientDTO } = require('../dto/ClientDTO');

class ClientService {
  /**
   * Transform database row to frontend format
   */
  static transformClientToFrontend(client, contacts = []) {
    const typeMap = {
      'TRANS': 'Transportation',
      'SUPPLIER': 'Supplier'
    };

    return {
      id: client.TaxID,
      taxId: client.TaxID,
      clientName: client.ClientName,
      regNmbr: client.RegNmbr,
      streetAndNumber: client.StreetAndNmbr,
      city: client.City,
      zipCode: client.ZIP,
      country: client.Country,
      address: `${client.StreetAndNmbr}, ${client.City} ${client.ZIP}, ${client.Country}`,
      email: client.Email,
      clientType: typeMap[client.ClientType] || 'Transportation',
      contacts: contacts.map(c => ({
        contactPersonID: c.ContactPersonID,
        name: c.ContactName,
        description: c.Description,
        phoneNumber: c.PhoneNmbr,
        email: c.PersonEmail
      })),
      contactPerson: contacts.length > 0 ? {
        name: contacts[0].ContactName,
        description: contacts[0].Description,
        phoneNumber: contacts[0].PhoneNmbr,
        email: contacts[0].PersonEmail
      } : null
    };
  }

  /**
   * Get all clients with contacts
   */
  static async getAllClients() {
    const result = await Client.fetchAll();
    const rows = result.recordset;

    const clientMap = {};
    rows.forEach(row => {
      if (!clientMap[row.TaxID]) {
        clientMap[row.TaxID] = {
          client: {
            TaxID: row.TaxID,
            ClientName: row.ClientName,
            RegNmbr: row.RegNmbr,
            StreetAndNmbr: row.StreetAndNmbr,
            City: row.City,
            ZIP: row.ZIP,
            Country: row.Country,
            Email: row.Email,
            ClientType: row.ClientType
          },
          contacts: []
        };
      }

      if (row.ContactPersonID) {
        clientMap[row.TaxID].contacts.push({
          ContactPersonID: row.ContactPersonID,
          ContactName: row.ContactName,
          Description: row.Description,
          PhoneNmbr: row.PhoneNmbr,
          PersonEmail: row.PersonEmail
        });
      }
    });

    return Object.values(clientMap).map(item => 
      this.transformClientToFrontend(item.client, item.contacts)
    );
  }

  /**
   * Get client by TaxID
   */
  static async getClientByTaxId(taxId) {
    const clientRes = await Client.findClientByTaxId(taxId);
    if (clientRes.recordset.length === 0) {
      return null;
    }

    const client = clientRes.recordset[0];
    const contactRes = await Client.findContactsByTaxId(taxId);
    const contacts = contactRes.recordset;

    return this.transformClientToFrontend(client, contacts);
  }

  /**
   * Get client by RegNmbr
   */
  static async getClientByRegNmbr(regNmbr) {
    const clientRes = await Client.findClientByRegNmbr(regNmbr);
    if (clientRes.recordset.length === 0) {
      return null;
    }

    const client = clientRes.recordset[0];
    const contactRes = await Client.findContactsByTaxId(client.TaxID);
    const contacts = contactRes.recordset;

    return this.transformClientToFrontend(client, contacts);
  }

  /**
   * Get client by ClientName
   */
  static async getClientByClientName(clientName) {
    const clientRes = await Client.findClientByClientName(clientName);
    if (clientRes.recordset.length === 0) {
      return null;
    }

    const client = clientRes.recordset[0];
    const contactRes = await Client.findContactsByTaxId(client.TaxID);
    const contacts = contactRes.recordset;

    return this.transformClientToFrontend(client, contacts);
  }

  /**
   * Create or update client (UPSERT)
   */
  static async upsertClient(data) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      // Create DTO and validate
      const clientDTO = new ClientDTO(data);
      const validationErrors = clientDTO.validate();

      if (validationErrors.length > 0) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Start transaction
      await transaction.begin();

      // Check if client exists
      const existingClient = await Client.findClientByTaxId(clientDTO.TaxID);
      
      // Check RegNmbr uniqueness (ako nije null)
      if (clientDTO.RegNmbr) {
        const existingByRegNmbr = await Client.findClientByRegNmbr(clientDTO.RegNmbr);
        if (existingByRegNmbr.recordset.length > 0 && 
            existingByRegNmbr.recordset[0].TaxID !== clientDTO.TaxID) {
          throw {
            status: 409,
            message: 'Client with this Registration Number already exists'
          };
        }
      }

      // Upsert client
      await Client.upsert(clientDTO, transaction);

      // Commit transaction
      await transaction.commit();

      // Return updated client
      return await this.getClientByTaxId(clientDTO.TaxID);

    } catch (err) {
      if (transaction && transaction._aborted !== true) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  /**
   * Delete client (soft delete)
   */
  static async deleteClient(taxId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Check if client exists
      const client = await Client.findClientByTaxId(taxId);
      if (client.recordset.length === 0) {
        throw {
          status: 404,
          message: 'Client not found'
        };
      }

      // Soft delete (IsActive = 0)
      await Client.deleteClient(taxId, transaction);

      await transaction.commit();

      return { success: true, message: 'Client deleted successfully' };
    } catch (err) {
      if (transaction && transaction._aborted !== true) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  /**
   * Delete contact person
   */
  static async deleteContact(contactPersonId) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Delete contact (CASCADE će obrisati iz baze zbog FK)
      await Client.deleteContact(contactPersonId, transaction);

      await transaction.commit();

      return { success: true, message: 'Contact deleted successfully' };
    } catch (err) {
      if (transaction && transaction._aborted !== true) {
        await transaction.rollback();
      }
      throw err;
    }
  }
}

module.exports = ClientService;