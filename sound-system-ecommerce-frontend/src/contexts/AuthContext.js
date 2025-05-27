// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate is used in logout
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const USER_STORAGE_KEY = 'soundSystemUser';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [authError, setAuthError] = useState(null); // State for auth errors
  const navigate = useNavigate(); // For logout redirect

  useEffect(() => {
    setLoadingAuthState(true);
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('[AuthContext] Error loading auth state from localStorage:', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setLoadingAuthState(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoadingAuthState(true);
    setAuthError(null); // Clear previous errors
    try {
      const response = await authService.login({ email, password });
      const { user } = response.data;
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      console.log(`[AuthContext] Login successful. User:`, user);
      setLoadingAuthState(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      console.error('[AuthContext] Login failed:', errorMessage);
      setAuthError(errorMessage);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(USER_STORAGE_KEY);
      setLoadingAuthState(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log('[AuthContext] User logged out.');
    navigate('/login'); // Redirect after logout
  }, [navigate]);

  const register = useCallback(async (name, email, password) => {
    setLoadingAuthState(true);
    setAuthError(null); // Clear previous errors
    try {
      await authService.register({ name, email, password });
      // For now, registration success means user should proceed to login.
      // You could also automatically log them in here by calling login().
      console.log('[AuthContext] Registration successful via service. Please log in.');
      setLoadingAuthState(false);
      return true; 
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed.';
      console.error('[AuthContext] Registration failed:', errorMessage);
      setAuthError(errorMessage);
      setLoadingAuthState(false);
      return false;
    }
  }, []);

  const updateUserProfile = useCallback((updatedData) => {
    if (!currentUser) {
      console.error('[AuthContext] No current user to update.');
      setAuthError('No current user to update.'); // Optionally set an error
      return false;
    }
    const updatedUser = {
      ...currentUser,
      name: updatedData.name || currentUser.name,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      console.log('[AuthContext] User profile updated:', updatedUser);
      return true;
    } catch (error) {
      console.error('[AuthContext] Error saving updated user profile to localStorage:', error);
      setAuthError('Failed to save profile update locally.'); // Optionally set an error
      return false;
    }
  }, [currentUser]);

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin: currentUser?.isAdmin || false,
    loadingAuthState,
    authError,
    login,
    logout,
    register,
    updateUserProfile,
    setAuthError, // Make sure this is the actual setter from useState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}