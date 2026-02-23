import api from '@/shared/services/api';

export const outgoingInvoiceService = {
  // Dohvatanje svih izlaznih faktura
  getAllOutgoingInvoices: async () => {
    try {
      const response = await api.get('/outInvoice/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching Outgoing Invoices:', error);
      throw error;
    }
  }
};

export default outgoingInvoiceService;
