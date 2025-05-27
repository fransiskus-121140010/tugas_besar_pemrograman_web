// src/components/routing/AdminProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loadingAuthState } = useAuth(); // Add loadingAuthState
  const location = useLocation();

  if (loadingAuthState) {
    // If still loading auth state, don't render anything yet (or show a loader)
    // This prevents a flash of the login page or premature redirect
    return <p>Loading authentication...</p>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.warn('[AdminProtectedRoute] User is authenticated but NOT an admin. Redirecting to /.');
    return <Navigate to="/" replace />;
  }

  return children; 
}

export default AdminProtectedRoute;