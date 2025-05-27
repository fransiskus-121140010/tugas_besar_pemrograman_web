// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loadingAuthState } = useAuth(); // Add loadingAuthState
  const location = useLocation();

  if (loadingAuthState) {
    return <p>Loading authentication...</p>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; 
}

export default ProtectedRoute;