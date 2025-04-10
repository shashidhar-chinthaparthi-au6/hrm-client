import api from './api';

const BASE_PATH = '/performance';

export const performanceService = {
  getReviews: async (filters = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/reviews`, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReviewById: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await api.post(`${BASE_PATH}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`${BASE_PATH}/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitReview: async (id) => {
    try {
      const response = await api.put(`${BASE_PATH}/reviews/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getGoals: async (employeeId, cycleId) => {
    try {
      const response = await api.get(`${BASE_PATH}/goals`, {
        params: { employeeId, cycleId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post(`${BASE_PATH}/goals`, goalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`${BASE_PATH}/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSkillMatrix: async (departmentId) => {
    try {
      const response = await api.get(`${BASE_PATH}/skills`, {
        params: { departmentId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEmployeeSkills: async (employeeId, skillsData) => {
    try {
      const response = await api.put(`${BASE_PATH}/skills/${employeeId}`, skillsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFeedback: async (employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/feedback/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post(`${BASE_PATH}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppraisalCycles: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/cycles`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAppraisalCycle: async (cycleData) => {
    try {
      const response = await api.post(`${BASE_PATH}/cycles`, cycleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default performanceService;