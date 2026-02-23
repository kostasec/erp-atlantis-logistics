// services/employeeService.js
import api from '@/shared/services/api';

export const employeeService = {
  /**
   * Get all active employees
   */
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employee');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  /**
   * Get all active drivers
   */
  getDrivers: async () => {
    try {
      const response = await api.get('/employee/drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  /**
   * Get all active managers
   */
  getManagers: async () => {
    try {
      const response = await api.get('/employee/managers');
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: async (employeeId) => {
    try {
      const response = await api.get(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  /**
   * Get employee by full name (firstName lastName)
   */
  getEmployeeByName: async (fullName) => {
    try {
      const response = await api.get(`/employee/by-name/${fullName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee by name:', error);
      throw error;
    }
  },

  /**
   * Create new employee
   */
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employee', employeeData);
      return response.data;
    } catch (error) {
      console.error('Employee create error:', error);
      
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
      throw new Error('Failed to create employee. Please check your connection.');
    }
  },

  /**
   * Update employee
   */
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.put(`/employee/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Employee update error:', error);
      
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
      throw new Error('Failed to update employee. Please check your connection.');
    }
  },

  /**
   * Delete employee (soft delete)
   */
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Employee delete error:', error);
      throw error;
    }
  }
};

export default employeeService;