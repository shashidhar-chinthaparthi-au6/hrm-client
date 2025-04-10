// /client/src/routes/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Admin-only route component that requires authentication and admin role
 * Redirects to dashboard if user is not an admin
 */
const AdminRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication and role status
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Check if user is authenticated and has admin role
  const isAdmin = user && (user.role === 'admin' || user.isAdmin);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to dashboard if authenticated but not an admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes if authenticated and has admin role
  return <Outlet />;
};

export default AdminRoute;