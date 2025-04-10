import api from './api';

const BASE_PATH = '/dashboard';

export const dashboardService = {
  getSummary: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceStats: async (startDate, endDate) => {
    try {
      const response = await api.get(`${BASE_PATH}/attendance-stats`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeStats: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/employee-stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLeaveStats: async (year) => {
    try {
      const response = await api.get(`${BASE_PATH}/leave-stats`, {
        params: { year },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPayrollStats: async (year) => {
    try {
      const response = await api.get(`${BASE_PATH}/payroll-stats`, {
        params: { year },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/recent-activities`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUpcomingEvents: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/upcoming-events`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPerformanceMetrics: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/performance-metrics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartmentDistribution: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/department-distribution`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;