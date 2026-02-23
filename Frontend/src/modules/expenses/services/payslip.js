import api from '@/shared/services/api';

export const payslipService = {

    // Dohvatanje imena aktivnih vozača
    getDriverNames: async () => {
        try {
            const response = await api.get('/payslip/read/drivers');
            return response.data;
        } catch (error) {
            console.error('Error fetching driver names:', error);
            throw error;
        }
    },

    // Dohvatanje grupisanih payslips sa RSD i EUR podacima
    getGroupedPaySlips: async () => {
        try {
            const response = await api.get('/payslip/read/transaction/groupedPayslip');
            return response.data;
        } catch (error) {
            console.error('Error fetching grouped payslips:', error);
            throw error;
        }
    },

    // Dohvatanje RSD transakcija
    getTransactionRSD: async () => {
        try {
            const response = await api.get('/payslip/read/transaction/rsd');
            return response.data;
        } catch (error) {
            console.error('Error fetching RSD transactions:', error);
            throw error;
        }
    },

    // Dohvatanje EUR transakcija
    getTransactionEUR: async () => {
        try {
            const response = await api.get('/payslip/read/transaction/eur');
            return response.data;
        } catch (error) {
            console.error('Error fetching EUR transactions:', error);
            throw error;
        }
    },

   
};
