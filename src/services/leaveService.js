import api from './api';

const BASE_PATH = '/leaves';

export const leaveService = {
  getAllLeaves: async (filters = {}) => {
    try {
      const response = await api.get(BASE_PATH, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLeaveById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  applyLeave: async (leaveData) => {
    try {
      const response = await api.post(BASE_PATH, leaveData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateLeave: async (id, leaveData) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}`, leaveData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelLeave: async (id) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approveLeave: async (id, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/approve`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rejectLeave: async (id, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/reject`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLeaveBalance: async (employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/balance/${employeeId || ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLeaveCalendar: async (month, year) => {
    try {
      const response = await api.get(`${BASE_PATH}/calendar`, {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLeaveTypes: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/types`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateLeavePolicy: async (policyData) => {
    try {
      const response = await api.put(`${BASE_PATH}/policy`, policyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHolidays: async (year) => {
    try {
      const response = await api.get(`${BASE_PATH}/holidays`, {
        params: { year },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default leaveService;