// src/contexts/AuthContext.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Helper component to consume the context
const TestAuthConsumer = ({ onRender }) => {
  const authContextValue = useAuth();
  if (onRender) {
    onRender(authContextValue);
  }
  return null;
};

describe('AuthContext', () => {
  let capturedContextValue;
  let originalConsoleLog;
  let originalConsoleError;

  const renderWithAuthProvider = () => {
    return render(
      <AuthProvider>
        <TestAuthConsumer onRender={(value) => { capturedContextValue = value; }} />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    capturedContextValue = null;
    // Mock console methods to keep test output clean
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    jest.restoreAllMocks();
  });

  it('should initialize with isAuthenticated as false and currentUser as null', () => {
    renderWithAuthProvider();
    expect(capturedContextValue.isAuthenticated).toBe(false);
    expect(capturedContextValue.currentUser).toBeNull();
  });

  describe('login', () => {
    it('should set isAuthenticated to true and set currentUser on successful mock login', async () => {
      renderWithAuthProvider();
      let loginSuccess;
      await act(async () => { // act for async operations if login were truly async
        loginSuccess = capturedContextValue.login('test@example.com', 'password');
      });
      expect(loginSuccess).toBe(true);
      expect(capturedContextValue.isAuthenticated).toBe(true);
      expect(capturedContextValue.currentUser).toEqual({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should return false and not change state if email is missing', async () => {
      renderWithAuthProvider();
      let loginSuccess;
      await act(async () => {
        loginSuccess = capturedContextValue.login('', 'password');
      });
      expect(loginSuccess).toBe(false);
      expect(capturedContextValue.isAuthenticated).toBe(false);
      expect(capturedContextValue.currentUser).toBeNull();
    });

    it('should return false and not change state if password is missing', async () => {
      renderWithAuthProvider();
      let loginSuccess;
      await act(async () => {
        loginSuccess = capturedContextValue.login('test@example.com', '');
      });
      expect(loginSuccess).toBe(false);
      expect(capturedContextValue.isAuthenticated).toBe(false);
      expect(capturedContextValue.currentUser).toBeNull();
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false and currentUser to null', async () => {
      renderWithAuthProvider();
      // First, log in
      await act(async () => {
        capturedContextValue.login('test@example.com', 'password');
      });
      expect(capturedContextValue.isAuthenticated).toBe(true); // Pre-condition

      // Then, log out
      act(() => { // logout is synchronous in mock
        capturedContextValue.logout();
      });
      expect(capturedContextValue.isAuthenticated).toBe(false);
      expect(capturedContextValue.currentUser).toBeNull();
    });
  });

  describe('register', () => {
    it('should return true on successful mock registration (does not change auth state directly)', async () => {
      renderWithAuthProvider();
      let registerSuccess;
      await act(async () => {
        registerSuccess = capturedContextValue.register('New User', 'new@example.com', 'newpass');
      });
      expect(registerSuccess).toBe(true);
      // Verify that mock register doesn't automatically log in the user
      // unless we explicitly designed it that way (current mock doesn't auto-login)
      expect(capturedContextValue.isAuthenticated).toBe(false);
      expect(capturedContextValue.currentUser).toBeNull();
    });

    it('should return false if name is missing during registration', async () => {
      renderWithAuthProvider();
      let registerSuccess;
      await act(async () => {
        registerSuccess = capturedContextValue.register('', 'new@example.com', 'newpass');
      });
      expect(registerSuccess).toBe(false);
    });
    // Add more tests for other missing fields (email, password) for register if desired
  });
});