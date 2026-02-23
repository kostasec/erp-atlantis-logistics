// services/vehicleService.js
import api from '@/shared/services/api';

export const vehicleService = {
  /**
   * Get all vehicles (trucks, trailers, compositions, cars)
   */
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicle/all');
      return response.data;  // This returns { success: true, data: { trucks, trailers, compositions, cars } }
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      throw error;
    }
  },

  /**
   * Get available employees for car assignment (non-drivers)
   */
  getAvailableEmployeesForCar: async () => {
    try {
      const response = await api.get('/vehicle/available-employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching available employees for car:', error);
      throw error;
    }
  },

  /**
   * Create vehicle (truck, trailer, or car)
   */
  createVehicle: async (vehicleData) => {
    try {
      let endpoint = '';
      
      switch (vehicleData.vehicleType) {
        case 'truck':
          endpoint = '/vehicle/truck';
          break;
        case 'trailer':
          endpoint = '/vehicle/trailer';
          break;
        case 'car':
          endpoint = '/vehicle/car';
          break;
        case 'composition':
          endpoint = '/vehicle/composition';
          break;
        default:
          throw new Error('Invalid vehicle type');
      }

      const response = await api.post(endpoint, vehicleData);
      return response.data;
    } catch (error) {
      console.error('Vehicle creation error:', error);
      throw error;
    }
  },

  /**
   * Create full composition with optional new truck/trailer and driver assignment
   * Handles all 3 scenarios in one atomic transaction:
   * - newComposition: creates new truck + new trailer + composition + optional driver
   * - newTruckExistingTrailer: creates new truck + uses existing trailer + composition + optional driver
   * - newTrailerExistingTruck: uses existing truck + creates new trailer + composition + optional driver
   */
  createFullComposition: async (compositionData) => {
    try {
      const response = await api.post('/vehicle/composition-full', compositionData);
      return response.data;
    } catch (error) {
      console.error('Full composition creation error:', error);
      throw error;
    }
  },

  /**
   * Create full car with optional driver assignment
   */
  createFullCar: async (carData) => {
    try {
      const response = await api.post('/vehicle/car-full', carData);
      return response.data;
    } catch (error) {
      console.error('Full car creation error:', error);
      throw error;
    }
  },

  /**
   * Update composition truck
   */
  updateCompositionTruck: async (compositionId, truckId) => {
    try {
      const response = await api.put(`/vehicle/composition/${compositionId}/truck`, { truckId });
      return response.data;
    } catch (error) {
      console.error('Update composition truck error:', error);
      throw error;
    }
  },

  /**
   * Update composition trailer
   */
  updateCompositionTrailer: async (compositionId, trailerId) => {
    try {
      const response = await api.put(`/vehicle/composition/${compositionId}/trailer`, { trailerId });
      return response.data;
    } catch (error) {
      console.error('Update composition trailer error:', error);
      throw error;
    }
  },

  /**
   * Remove driver from composition
   */
  removeDriverFromComposition: async (driverCompId) => {
    try {
      const response = await api.delete(`/vehicle/composition/driver/${driverCompId}`);
      return response.data;
    } catch (error) {
      console.error('Remove driver from composition error:', error);
      throw error;
    }
  },

  /**
   * Update driver in composition
   */
  updateCompositionDriver: async (driverCompId, driverId) => {
    try {
      const response = await api.put(`/vehicle/composition/driver/${driverCompId}`, { driverId });
      return response.data;
    } catch (error) {
      console.error('Update composition driver error:', error);
      throw error;
    }
  },

  /**
   * Assign driver to composition
   */
  assignDriverToComposition: async (compositionId, driverId) => {
    try {
      const response = await api.post(`/vehicle/composition/${compositionId}/driver`, { driverId });
      return response.data;
    } catch (error) {
      console.error('Assign driver to composition error:', error);
      throw error;
    }
  },

  /**
   * Delete composition (decompose)
   */
  deleteComposition: async (compositionId) => {
    try {
      const response = await api.delete(`/vehicle/composition/${compositionId}`);
      return response.data;
    } catch (error) {
      console.error('Delete composition error:', error);
      throw error;
    }
  },

  /**
   * Update vehicle
   */
  updateVehicle: async (vehicleType, vehicleId, vehicleData) => {
    try {
      let endpoint = '';
      
      switch (vehicleType) {
        case 'truck':
          endpoint = `/vehicle/truck/${vehicleId}`;
          break;
        case 'trailer':
          endpoint = `/vehicle/trailer/${vehicleId}`;
          break;
        case 'car':
          endpoint = `/vehicle/car/${vehicleId}`;
          break;
        default:
          throw new Error('Invalid vehicle type');
      }

      const response = await api.put(endpoint, vehicleData);
      return response.data;
    } catch (error) {
      console.error('Vehicle update error:', error);
      throw error;
    }
  },

  /**
   * Delete vehicle
   */
  deleteVehicle: async (vehicleType, vehicleId) => {
    try {
      let endpoint = '';
      
      switch (vehicleType) {
        case 'truck':
          endpoint = `/vehicle/truck/${vehicleId}`;
          break;
        case 'trailer':
          endpoint = `/vehicle/trailer/${vehicleId}`;
          break;
        case 'car':
          endpoint = `/vehicle/car/${vehicleId}`;
          break;
        case 'composition':
          endpoint = `/vehicle/composition/${vehicleId}`;
          break;
        default:
          throw new Error('Invalid vehicle type');
      }

      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Vehicle deletion error:', error);
      throw error;
    }
  },

  /**
   * Create composition
   */
  createComposition: async (truckId, trailerId) => {
    try {
      const response = await api.post('/vehicle/composition', {
        vehicleType: 'composition',
        truckId,
        trailerId
      });
      return response.data;
    } catch (error) {
      console.error('Composition creation error:', error);
      throw error;
    }
  },

  /**
   * Assign employee to car
   */
  assignEmployeeToCar: async (carId, employeeId) => {
    try {
      const response = await api.post(`/vehicle/car/${carId}/employee`, { employeeId });
      return response.data;
    } catch (error) {
      console.error('Assign employee to car error:', error);
      throw error;
    }
  },

  /**
   * Remove employee from car
   */
  removeEmployeeFromCar: async (employeeId) => {
    try {
      const response = await api.delete(`/vehicle/car/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Remove employee from car error:', error);
      throw error;
    }
  },

  /**
   * Update employee car assignment
   */
  updateEmployeeCarAssignment: async (employeeId, carId) => {
    try {
      const response = await api.put(`/vehicle/car/employee/${employeeId}`, { carId });
      return response.data;
    } catch (error) {
      console.error('Update employee car assignment error:', error);
      throw error;
    }
  }
};

export default vehicleService;
