import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { setAuthData, getAuthData, clearAuthData } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const authData = getAuthData();
      if (authData?.token && authData?.user) {
        // Set token in axios headers
        authService.setAuthToken(authData.token);
        
        // Update state
        setUser(authData.user);
        setIsAuthenticated(true);
        
        // Verify token is still valid
        try {
          await authService.verifyToken();
        } catch (error) {
          // If token verification fails, try to refresh
          try {
            await authService.refreshToken();
          } catch (refreshError) {
            // If refresh fails, clear everything
            clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, token, refreshToken } = await authService.login(credentials);
      
      // Set auth data in storage with rememberMe true
      setAuthData({ user, token, refreshToken }, true);
      
      // Set token in axios headers
      authService.setAuthToken(token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return { user, token };
    } catch (error) {
      console.error('Auth context: Login failed', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      authService.setAuthToken(null);
      setUser(null);
      setError(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.register(userData);
      setAuthData({ token, user }, true);
      authService.setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.updateProfile(profileData);
      const authData = getAuthData();
      if (authData) {
        setAuthData({ ...authData, user }, true);
      }
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;