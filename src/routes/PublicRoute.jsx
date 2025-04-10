// /client/src/routes/PublicRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Public route component for non-authenticated pages
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Get the intended destination after login (if any)
  const from = location.state?.from || '/dashboard';

  // Show loading indicator while checking authentication status
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to intended destination or dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Render child routes for non-authenticated users
  return <Outlet />;
};

export default PublicRoute;