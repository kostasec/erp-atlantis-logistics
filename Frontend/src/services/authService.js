import api from '../shared/services/api';

class AuthService {
  /**
   * Login korisnika
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        return {
          token: response.data.token,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please try again.');
    }
  }

  /**
   * Dobijanje trenutnog korisnika na osnovu tokena
   */
  async getCurrentUser(token) {
    try {
      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return {
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Token verification failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Registracija novog korisnika (admin only)
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error. Please try again.');
    }
  }

  /**
   * Logout (local storage cleanup)
   */
  logout() {
    localStorage.removeItem('authToken');
  }

  /**
   * Provera da li je korisnik ulogovan
   */
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Dobijanje JWT tokena iz local storage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();