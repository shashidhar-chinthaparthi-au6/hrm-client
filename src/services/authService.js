import api from './api';
// import { API_BASE_URL } from '../config';
import { setAuthData, getAuthData, clearAuthData } from '../utils/storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token, refreshToken, rememberMe } = response.data.data;
      
      // Store auth data
      setAuthData({ token, refreshToken, user }, rememberMe);
      
      return { user, token, refreshToken };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token, refreshToken } = response.data.data;
      
      // Store auth data
      setAuthData({ token, refreshToken, user }, true);
      
      return { user, token, refreshToken };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const authData = getAuthData();
      if (!authData?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', {
        refreshToken: authData.refreshToken
      });

      const { token, refreshToken } = response.data.data;
      
      // Update stored tokens
      const updatedAuthData = {
        ...authData,
        token,
        refreshToken
      };
      
      setAuthData(updatedAuthData, true);
      
      return { token, refreshToken };
    } catch (error) {
      // If refresh fails, clear auth data and redirect to login
      clearAuthData();
      throw this.handleError(error);
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      const { user } = response.data.data;
      
      // Update stored user data
      const authData = getAuthData();
      if (authData) {
        setAuthData({ ...authData, user }, true);
      }
      
      return user;
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

  logout() {
    clearAuthData();
  }

  isAuthenticated() {
    const authData = getAuthData();
    return !!authData?.token;
  }

  getToken() {
    const authData = getAuthData();
    return authData?.token;
  }

  getUser() {
    const authData = getAuthData();
    return authData?.user;
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      
      // Handle specific error cases
      switch (status) {
        case 401:
          // Clear auth data on unauthorized
          clearAuthData();
          break;
        case 403:
          // Handle forbidden
          break;
        case 422:
          // Handle validation errors
          break;
        default:
          // Handle other errors
          break;
      }
      
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Other errors
      return error;
    }
  }
}

export default new AuthService();