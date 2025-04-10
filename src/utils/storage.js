// storage.js - Storage utilities

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_STATE: 'sidebar_state',
    RECENT_SEARCHES: 'recent_searches',
    NOTIFICATIONS: 'notifications',
    REMEMBER_ME: 'remember_me',
    ATTENDANCE_CACHE: 'attendance_cache',
    LAST_ACTIVITY: 'last_activity',
    FILTERS: 'filters'
  };
  
  /**
   * Set item in localStorage with optional expiry
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {number} [ttl] - Time to live in milliseconds
   */
  export const setLocalStorageItem = (key, value, ttl = null) => {
    try {
      const item = {
        value,
        ...(ttl && { expiry: new Date().getTime() + ttl })
      };
      
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  };
  
  /**
   * Get item from localStorage, respecting expiry if set
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found or expired
   * @returns {*} Stored value or default
   */
  export const getLocalStorageItem = (key, defaultValue = null) => {
    try {
      const itemStr = localStorage.getItem(key);
      
      // Return default if no item found
      if (!itemStr) return defaultValue;
      
      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (item.expiry && new Date().getTime() > item.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  };
  
  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  export const removeLocalStorageItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  };
  
  /**
   * Clear all localStorage items
   */
  export const clearLocalStorage = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  };
  
  /**
   * Set item in sessionStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  export const setSessionStorageItem = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify({ value }));
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
      return false;
    }
  };
  
  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  export const getSessionStorageItem = (key, defaultValue = null) => {
    try {
      const itemStr = sessionStorage.getItem(key);
      
      // Return default if no item found
      if (!itemStr) return defaultValue;
      
      const item = JSON.parse(itemStr);
      return item.value;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  };
  
  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   */
  export const removeSessionStorageItem = (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  };
  
  /**
   * Clear all sessionStorage items
   */
  export const clearSessionStorage = () => {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  };
  
  /**
   * Set authentication data in storage
   * @param {Object} authData - Auth data with token, refreshToken and user
   * @param {boolean} rememberMe - Whether to use localStorage or sessionStorage
   */
  export const setAuthData = (authData, rememberMe = false) => {
    const { token, refreshToken, user } = authData;
    
    if (rememberMe) {
      // Store in localStorage with 7-day expiry
      setLocalStorageItem(STORAGE_KEYS.AUTH_TOKEN, token, 7 * 24 * 60 * 60 * 1000);
      setLocalStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, 30 * 24 * 60 * 60 * 1000);
      setLocalStorageItem(STORAGE_KEYS.USER, user);
      setLocalStorageItem(STORAGE_KEYS.REMEMBER_ME, true);
    } else {
      // Store in sessionStorage (cleared when browser tab is closed)
      setSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setSessionStorageItem(STORAGE_KEYS.USER, user);
      setLocalStorageItem(STORAGE_KEYS.REMEMBER_ME, false);
    }
  };
  
  /**
   * Get authentication data from storage
   * @returns {Object|null} Auth data or null if not found
   */
  export const getAuthData = () => {
    // Try localStorage first (for remembered user)
    const rememberMe = getLocalStorageItem(STORAGE_KEYS.REMEMBER_ME, false);
    
    if (rememberMe) {
      const token = getLocalStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = getLocalStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
      const user = getLocalStorageItem(STORAGE_KEYS.USER);
      
      if (token && user) {
        return { token, refreshToken, user };
      }
    }
    
    // Then try sessionStorage
    const token = getSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = getSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    const user = getSessionStorageItem(STORAGE_KEYS.USER);
    
    if (token && user) {
      return { token, refreshToken, user };
    }
    
    return null;
  };
  
  /**
   * Clear all authentication data from storage
   */
  export const clearAuthData = () => {
    // Clear from localStorage
    removeLocalStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeLocalStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeLocalStorageItem(STORAGE_KEYS.USER);
    
    // Clear from sessionStorage
    removeSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeSessionStorageItem(STORAGE_KEYS.USER);
  };
  
  /**
   * Get user theme preference
   * @returns {string} Theme name ('light', 'dark', 'system')
   */
  export const getThemePreference = () => {
    return getLocalStorageItem(STORAGE_KEYS.THEME, 'system');
  };
  
  /**
   * Set user theme preference
   * @param {string} theme - Theme name ('light', 'dark', 'system')
   */
  export const setThemePreference = (theme) => {
    setLocalStorageItem(STORAGE_KEYS.THEME, theme);
  };
  
  /**
   * Store filter settings
   * @param {string} screen - Screen identifier
   * @param {Object} filters - Filter settings
   */
  export const saveFilters = (screen, filters) => {
    const allFilters = getLocalStorageItem(STORAGE_KEYS.FILTERS, {});
    allFilters[screen] = filters;
    setLocalStorageItem(STORAGE_KEYS.FILTERS, allFilters);
  };
  
  /**
   * Get stored filter settings
   * @param {string} screen - Screen identifier
   * @returns {Object} Filter settings
   */
  export const getFilters = (screen) => {
    const allFilters = getLocalStorageItem(STORAGE_KEYS.FILTERS, {});
    return allFilters[screen] || {};
  };
  
  export default {
    STORAGE_KEYS,
    setLocalStorageItem,
    getLocalStorageItem,
    removeLocalStorageItem,
    clearLocalStorage,
    setSessionStorageItem,
    getSessionStorageItem,
    removeSessionStorageItem,
    clearSessionStorage,
    setAuthData,
    getAuthData,
    clearAuthData,
    getThemePreference,
    setThemePreference,
    saveFilters,
    getFilters
  };