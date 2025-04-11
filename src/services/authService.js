import api from './api';
// import { API_BASE_URL } from '../config';
import { setAuthData, getAuthData, clearAuthData } from '../utils/storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';

class AuthService {
  constructor() {
    // Set initial auth token from storage
    const authData = getAuthData();
    if (authData?.token) {
      this.setAuthToken(authData.token);
    }
  }

  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token, refreshToken } = response.data.data;
      
      // Set auth data in storage with rememberMe set to true
      setAuthData({ user, token, refreshToken }, true);
      
      // Set token in axios headers
      this.setAuthToken(token);
      
      return { user, token, refreshToken };
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token, refreshToken } = response.data.data;
      
      // Store auth data
      setAuthData({ token, refreshToken, user }, true);
      this.setAuthToken(token);
      
      return { user, token, refreshToken };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      this.setAuthToken(null);
    }
  }

  async refreshToken() {
    try {
      const { refreshToken } = getAuthData() || {};
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data.data;
      
      // Get current auth data
      const currentAuthData = getAuthData();
      
      // Update auth data in storage
      setAuthData({ 
        ...currentAuthData,
        token,
        refreshToken: newRefreshToken
      }, true);
      
      // Update token in axios headers
      this.setAuthToken(token);
      
      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      // Clear auth data on refresh failure
      clearAuthData();
      this.setAuthToken(null);
      throw error;
    }
  }

  async getCurrentUser() {
    return getAuthData()?.user;
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return error.response.data;
    } else if (error.request) {
      // Request made but no response
      return { message: 'No response from server' };
    } else {
      // Other errors
      return { message: error.message };
    }
  }

  isAuthenticated() {
    return !!getAuthData()?.token;
  }

  getToken() {
    const authData = getAuthData();
    return authData?.token;
  }

  getUser() {
    const authData = getAuthData();
    return authData?.user;
  }
}

export default new AuthService();