import api from '@/shared/services/api';

export const vehicleInspection = {
    //Dohvatanje vehicleinspections
    getVehicleInspection: async () =>{
        try{
            const response = await api.get('/inspection/read/vehicleInspection');
            return response.data;
        } catch (error) {
            console.error('Error fetching inspections: ', error);
            throw error;
        }
    },

    //Dohvatanje employeeInspection
     getEmployeeInspection: async () =>{
        try{
            const response = await api.get('/inspection/read/employeeInspection');
            return response.data;
        } catch (error) {
            console.error('Error fetching inspections: ', error);
            throw error;
        }
    },

    //Dohvatanje InspectionOther
    getInspectionOther: async () =>{
        try{
            const response = await api.get('/inspection/read/inspectionOther');
            return response.data;
        } catch (error) {
            console.error('Error fetching inspections: ', error);
            throw error;
        }
    }

};