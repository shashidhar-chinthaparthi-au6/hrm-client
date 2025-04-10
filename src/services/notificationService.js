import api from './api';

const BASE_PATH = '/notifications';

export const notificationService = {
  getAll: async () => {
    try {
      const response = await api.get(BASE_PATH);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUnread: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/unread`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put(`${BASE_PATH}/read-all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNotificationSettings: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/settings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put(`${BASE_PATH}/settings`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  subscribe: async (subscription) => {
    try {
      const response = await api.post(`${BASE_PATH}/subscribe`, subscription);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unsubscribe: async () => {
    try {
      const response = await api.post(`${BASE_PATH}/unsubscribe`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;