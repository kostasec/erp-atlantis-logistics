// services/clientService.js
import api from '@/shared/services/api';

export const clientService = {
  /**
   * Get all clients
   */
  getAllClients: async () => {
    try {
      const response = await api.get('/client');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  /**
   * Get client by Tax ID
   */
  getClientByTaxId: async (taxId) => {
    try {
      const response = await api.get(`/client/${taxId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  /**
   * Get client by Registration Number
   */
  getClientByRegNmbr: async (regNmbr) => {
    try {
      const response = await api.get(`/client/by-reg/${regNmbr}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client by reg number:', error);
      throw error;
    }
  },

  /**
   * Get client by Client Name
   */
  getClientByName: async (clientName) => {
    try {
      const response = await api.get(`/client/by-name/${clientName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client by name:', error);
      throw error;
    }
  },

  /**
   * Create or update client (UPSERT)
   */
  upsertClient: async (clientData) => {
    try {
      const response = await api.post('/client', clientData);
      return response.data;
    } catch (error) {
      console.error('Client upsert error:', error);
      
      // Structured error handling
      if (error.response?.data) {
        const { message, errors } = error.response.data;
        
        // Validation errors (400)
        if (errors && Array.isArray(errors)) {
          throw new Error(`Validation Error: ${errors.join(', ')}`);
        }
        
        // Other errors with message
        if (message) {
          throw new Error(message);
        }
      }
      
      // Network or unknown error
      throw new Error('Failed to save client. Please check your connection.');
    }
  },

  /**
   * Delete client
   */
  deleteClient: async (taxId) => {
    try {
      const response = await api.delete(`/client/${taxId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  /**
   * Delete client contact
   */
  deleteClientContact: async (contactId) => {
    try {
      const response = await api.delete(`/client/contact/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client contact:', error);
      throw error;
    }
  }
};

export default clientService;