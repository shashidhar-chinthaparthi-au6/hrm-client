// /client/src/utils/errorHandler.js

/**
 * Central error handling utility for the application
 * Handles API errors, UI errors, and provides consistent error handling
 */

// Common error status codes and messages
const ERROR_TYPES = {
    NETWORK_ERROR: 'Network Error',
    AUTH_ERROR: 'Authentication Error',
    SERVER_ERROR: 'Server Error',
    VALIDATION_ERROR: 'Validation Error',
    NOT_FOUND: 'Resource Not Found',
    PERMISSION_ERROR: 'Permission Denied',
    UNKNOWN_ERROR: 'Unknown Error'
  };
  
  /**
   * Process API error responses and return standardized error objects
   * @param {Error|Object} error - Error object from API or other sources
   * @returns {Object} Standardized error object
   */
  export const processApiError = (error) => {
    // Handle axios or fetch error objects
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return {
            type: ERROR_TYPES.VALIDATION_ERROR,
            message: data.message || 'Invalid request data',
            details: data.errors || {},
            status
          };
        case 401:
        case 403:
          return {
            type: ERROR_TYPES.AUTH_ERROR,
            message: data.message || 'Authentication failed or insufficient permissions',
            status
          };
        case 404:
          return {
            type: ERROR_TYPES.NOT_FOUND,
            message: data.message || 'Resource not found',
            status
          };
        case 500:
        case 502:
        case 503:
          return {
            type: ERROR_TYPES.SERVER_ERROR,
            message: data.message || 'Server error, please try again later',
            status
          };
        default:
          return {
            type: ERROR_TYPES.UNKNOWN_ERROR,
            message: data.message || 'An unexpected error occurred',
            status
          };
      }
    } else if (error.request) {
      // Request was made but no response was received
      return {
        type: ERROR_TYPES.NETWORK_ERROR,
        message: 'Unable to connect to the server, please check your internet connection',
      };
    } else {
      // Something happened in setting up the request
      return {
        type: ERROR_TYPES.UNKNOWN_ERROR,
        message: error.message || 'An unexpected error occurred',
      };
    }
  };
  
  /**
   * Log errors to console and optionally to a monitoring service
   * @param {Object} error - Error object
   * @param {string} context - The context where the error occurred
   */
  export const logError = (error, context = 'general') => {
    console.error(`[${context}]`, error);
    
    // Here you could integrate with error tracking services like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   // Example: Sentry.captureException(error);
    // }
  };
  
  /**
   * Handle form validation errors
   * @param {Object} errors - Validation errors object
   * @returns {Object} Formatted error messages by field
   */
  export const handleValidationErrors = (errors) => {
    if (!errors) return {};
    
    const formattedErrors = {};
    Object.keys(errors).forEach(field => {
      formattedErrors[field] = errors[field].message || errors[field];
    });
    
    return formattedErrors;
  };
  
  /**
   * Show user-friendly notification for errors
   * @param {Object} error - Error object
   * @param {Function} notifyFn - Function to show notification
   */
  export const showErrorNotification = (error, notifyFn) => {
    const errorObj = error.type ? error : processApiError(error);
    
    if (notifyFn && typeof notifyFn === 'function') {
      notifyFn({
        type: 'error',
        title: errorObj.type || ERROR_TYPES.UNKNOWN_ERROR,
        message: errorObj.message || 'An unknown error occurred'
      });
    }
  };
  
  /**
   * Generic error boundary handler for component error boundaries
   * @param {Error} error - Error object
   * @param {Object} errorInfo - React error info object
   */
  export const handleComponentError = (error, errorInfo) => {
    logError(error, 'Component');
    console.error(errorInfo);
    
    // Here you could send to error tracking service
    // Example: Sentry.captureException(error);
  };
  
  // Export the error types
  export { ERROR_TYPES };
  
  // Export errorHandler as named export
  export const errorHandler = {
    processApiError,
    logError,
    handleValidationErrors,
    showErrorNotification,
    handleComponentError
  };
  
  // Export errorHandler as default export too
  export default errorHandler;