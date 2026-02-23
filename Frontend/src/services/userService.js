import api from '../shared/services/api';

class UserService {
  /**
   * Dobijanje svih korisnika
   */
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching users');
    }
  }

  /**
   * Dobijanje jednog korisnika po ID-u
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching user');
    }
  }

  /**
   * Kreiranje novog korisnika
   */
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating user');
    }
  }

  /**
   * Ažuriranje korisnika
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating user');
    }
  }

  /**
   * Ažuriranje lozinke korisnika
   */
  async updateUserPassword(id, newPassword) {
    try {
      const response = await api.put(`/users/${id}/password`, { newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating password');
    }
  }

  /**
   * Deaktiviranje korisnika
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting user');
    }
  }

  /**
   * Generisanje privremenog passworda
   */
  async generateTempPassword(id) {
    try {
      const response = await api.post(`/users/${id}/temp-password`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error generating temporary password');
    }
  }
}

export const userService = new UserService();