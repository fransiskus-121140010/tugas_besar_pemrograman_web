// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState(''); // Use authError from context
  const { login, isAuthenticated, authError, setAuthError } = useAuth(); // Get authError, setAuthError
  const navigate = useNavigate();
  const location = useLocation(); // For redirecting after login

  // Clear authError when component mounts or email/password changes
  useEffect(() => {
    setAuthError(null); 
  }, [setAuthError]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null); // Clear previous errors from context
    if (!email || !password) {
      setAuthError('Please fill in all fields.'); // Set error locally or via context
      return;
    }
    try {
      const success = await login(email, password);
      if (success) {
        // Redirect to intended page or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } 
      // If login fails, authError will be set by AuthContext
    } catch (err) {
      // This catch block might not be strictly necessary if AuthContext handles all errors
      // and sets authError, but good for unexpected issues.
      console.error('Login page submit error:', err);
      setAuthError('An unexpected error occurred. Please try again.');
    }
  };

  // Redirect if already authenticated (e.g., user hits back button to login page)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {authError && <p className="auth-error">{authError}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setAuthError(null); }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={useAuth().loadingAuthState}>
          {useAuth().loadingAuthState ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch-prompt">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;