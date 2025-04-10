import api from './api';

const BASE_PATH = '/attendance';

export const attendanceService = {
  checkIn: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/check-in`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkOut: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/check-out`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTodayStatus: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/today-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeAttendance: async (employeeId, startDate, endDate) => {
    try {
      const response = await api.get(`${BASE_PATH}/employee/${employeeId}`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceReport: async (filters) => {
    try {
      const response = await api.get(`${BASE_PATH}/report`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceSummary: async (month, year) => {
    try {
      const response = await api.get(`${BASE_PATH}/summary`, {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAttendance: async (attendanceId, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/${attendanceId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  requestRegularization: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/regularize`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approveRegularization: async (requestId, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/regularize/${requestId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOvertimeRecords: async (filters) => {
    try {
      const response = await api.get(`${BASE_PATH}/overtime`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default attendanceService;