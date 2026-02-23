import api from '@/shared/services/api';

export const incomingInvoiceService = {
  // Dohvatanje svih ulaznih faktura
  getAllIncomingInvoices: async () => {
    try {
      const response = await api.get('/incInvoice/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching incoming invoices:', error);
      throw error;
    }
  },

  // Dohvatanje ulaznih faktura prevoznika
  getIncomingInvoiceCarriers: async () => {
    try {
      const response = await api.get('/incInvoice/read/IncInvCarrier');
      return response.data;
    } catch (error) {
      console.error('Error fetching carrier incoming invoices:', error);
      throw error;
    }
  },

  // Dohvatanje ulaznih faktura dobavljača
  getIncomingInvoiceSuppliers: async () => {
    try {
      const response = await api.get('/incInvoice/read/IncInvOther');
      return response.data;
    } catch (error) {
      console.error('Error fetching other incoming invoices:', error);
      throw error;
    }
  }
};

export default incomingInvoiceService;