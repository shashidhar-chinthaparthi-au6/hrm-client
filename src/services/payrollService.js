import api from './api';

const BASE_PATH = '/payroll';

export const payrollService = {
  getPayrollList: async (filters = {}) => {
    try {
      const response = await api.get(BASE_PATH, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPayrollById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generatePayroll: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/generate`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  processPayroll: async (id, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/process`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approvePayroll: async (id) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rejectPayroll: async (id, reason) => {
    try {
      const response = await api.put(`${BASE_PATH}/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generatePayslip: async (payrollId, employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/${payrollId}/payslip/${employeeId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeSalaryStructure: async (employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/salary-structure/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSalaryStructure: async (employeeId, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/salary-structure/${employeeId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTaxDeductions: async (employeeId, financialYear) => {
    try {
      const response = await api.get(`${BASE_PATH}/tax-deductions/${employeeId}`, {
        params: { financialYear },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBankDetails: async (employeeId, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/bank-details/${employeeId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBankDetails: async (employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/bank-details/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default payrollService;