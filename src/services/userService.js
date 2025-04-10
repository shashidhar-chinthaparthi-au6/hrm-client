import api from './api';

const BASE_PATH = '/users';

export const userService = {
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(`${BASE_PATH}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await api.put(`${BASE_PATH}/notifications`, notificationSettings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSecuritySettings: async (securityData) => {
    try {
      const response = await api.put(`${BASE_PATH}/security`, securityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 