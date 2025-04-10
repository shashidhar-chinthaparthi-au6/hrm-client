/**
 * config.js - Application configuration
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// App Configuration
export const APP_NAME = 'HRM System';
export const APP_VERSION = '1.0.0';
export const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || 'development';

// Date format configuration
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Session timeout (in minutes)
export const SESSION_TIMEOUT = 30;

// Theme configuration
export const DEFAULT_THEME = 'light';
export const THEME_STORAGE_KEY = 'hrm-theme';

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
};

// API Timeouts
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 120000, // 2 minutes
};

// Pagination
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]; 