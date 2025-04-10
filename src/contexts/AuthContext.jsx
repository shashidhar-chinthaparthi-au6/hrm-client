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
        setUser(authData.user);
        setIsAuthenticated(true);
        setAuthData(authData, true);
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
      console.log('Auth context: Login successful', { user, token });
      
      setAuthData({ token, refreshToken, user }, true);
      setUser(user);
      setIsAuthenticated(true);
      return { user, token, refreshToken };
    } catch (error) {
      console.error('Auth context: Login failed', error);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await authService.register(userData);
      setAuthData({ token, user });
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

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await authService.updateProfile(profileData);
      const authData = getAuthData();
      if (authData) {
        setAuthData({ ...authData, user });
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
    return true;
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