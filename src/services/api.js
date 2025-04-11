import axios from 'axios';
import { getAuthData, setAuthData } from '../utils/storage';
import authService from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from storage
    const authData = getAuthData();
    
    // Set the Authorization header if token exists
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }

    // Handle FormData
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    // Add cache control for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get current auth data
        const authData = getAuthData();
        if (!authData?.refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh the token
        const response = await api.post('/auth/refresh-token', {
          refreshToken: authData.refreshToken
        });

        const { token, refreshToken } = response.data.data;
        
        // Update auth data in storage
        setAuthData({
          ...authData,
          token,
          refreshToken
        }, true);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Only logout if we're not already on the login page
        if (window.location.pathname !== '/login') {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Other errors
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;