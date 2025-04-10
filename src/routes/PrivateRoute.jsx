// /client/src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Protected route component that requires authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication status
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;