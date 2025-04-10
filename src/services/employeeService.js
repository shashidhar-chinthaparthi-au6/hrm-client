import api from './api';

// Get all employees
export const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch employees' };
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch employee' };
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create employee' };
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update employee' };
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete employee' };
  }
};

const BASE_PATH = '/employees';

export const employeeService = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/employees', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with id ${id}:`, error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      // Ensure formData is FormData instance
      const employeeFormData = formData instanceof FormData ? formData : new FormData();
      
      // If formData is not FormData, convert it
      if (!(formData instanceof FormData)) {
        Object.keys(formData).forEach(key => {
          if (key === 'bankDetails' && typeof formData[key] === 'object') {
            employeeFormData.append(key, JSON.stringify(formData[key]));
          } else if (formData[key] !== null && formData[key] !== undefined) {
            employeeFormData.append(key, formData[key]);
          }
        });
      }

      const response = await api.post('/employees', employeeFormData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      // Ensure formData is FormData instance
      const employeeFormData = formData instanceof FormData ? formData : new FormData();
      
      // If formData is not FormData, convert it
      if (!(formData instanceof FormData)) {
        Object.keys(formData).forEach(key => {
          if (key === 'bankDetails' && typeof formData[key] === 'object') {
            employeeFormData.append(key, JSON.stringify(formData[key]));
          } else if (formData[key] !== null && formData[key] !== undefined) {
            employeeFormData.append(key, formData[key]);
          }
        });
      }

      const response = await api.put(`/employees/${id}`, employeeFormData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with id ${id}:`, error);
      throw error;
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDesignations: async () => {
    try {
      const response = await api.get('/designations');
      return response.data;
    } catch (error) {
      console.error('Error fetching designations:', error);
      throw error;
    }
  },

  getManagers: async () => {
    try {
      const response = await api.get('/employees/managers/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },

  getOrgChart: async () => {
    try {
      const response = await api.get('/employees/organization-chart');
      return response.data;
    } catch (error) {
      console.error('Error fetching organization chart:', error);
      throw error;
    }
  },

  uploadBulk: async (formData) => {
    try {
      const response = await api.post('/employees/bulk-upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading bulk employees:', error);
      throw error;
    }
  },

  getDocuments: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for employee ${employeeId}:`, error);
      throw error;
    }
  },

  uploadDocument: async (employeeId, formData) => {
    try {
      const response = await api.post(`/employees/${employeeId}/documents`, formData);
      return response.data;
    } catch (error) {
      console.error(`Error uploading document for employee ${employeeId}:`, error);
      throw error;
    }
  },
};

export default employeeService;