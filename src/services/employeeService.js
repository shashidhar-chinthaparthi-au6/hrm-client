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

  getDistinctFilters: async () => {
    try {
      const response = await api.get('/employees/distinct-filters');
      return response.data;
    } catch (error) {
      console.error('Error fetching distinct filters:', error);
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

  getCurrentUser: async () => {
    try {
      const response = await api.get('/employees/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  updateCurrentUser: async (formData) => {
    try {
      // If formData is not FormData, convert it
      if (!(formData instanceof FormData)) {
        // For nested objects, we need to stringify them
        const processedData = {};
        
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
              // Handle nested objects like department and designation
              processedData[key] = JSON.stringify(formData[key]);
            } else if (Array.isArray(formData[key])) {
              // Handle arrays like skills
              processedData[key] = JSON.stringify(formData[key]);
            } else {
              processedData[key] = formData[key];
            }
          }
        });
        
        // Send as JSON instead of FormData for complex objects
        const response = await api.put('/employees/me', processedData);
        
        // If response is null or undefined, return the processed data as success
        if (!response || !response.data) {
          console.warn('Server returned null response, using processed data');
          return { data: processedData };
        }
        
        return response;
      } else {
        // If it's already FormData, send it as is
        const response = await api.put('/employees/me', formData);
        
        // If response is null or undefined, return success
        if (!response || !response.data) {
          console.warn('Server returned null response for FormData');
          return { data: { success: true } };
        }
        
        return response;
      }
    } catch (error) {
      console.error('Error updating current user:', error);
      // Include more details in the error
      if (error.response) {
        throw {
          message: error.response.data?.message || 'Server error occurred',
          status: error.response.status,
          data: error.response.data
        };
      } else if (error.request) {
        throw {
          message: 'No response received from server',
          request: error.request
        };
      } else {
        throw {
          message: error.message || 'Failed to update profile',
          error
        };
      }
    }
  },
};

export default employeeService;