// src/services/authService.js
const USERS_STORAGE_KEY = 'minervaProAudioUsers'; // Key for the list of all registered users
// Note: USER_STORAGE_KEY (singular 'user') is used by AuthContext for the currently logged-in user.

const getStoredUsers = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error("Error parsing stored users:", e);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
  }
  // Initialize with an admin user in the list if it doesn't exist, for easier testing
  // This is a mock setup; real backends handle admin creation securely.
  const initialUsers = [
    // { 
    //   id: 'admin001', // Let's rely on the special email for admin identity for now
    //   email: 'admin@example.com', 
    //   name: 'Admin User (from list)', 
    //   isAdmin: true 
    // }
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users to storage:", e);
  }
};

let currentUsersList = getStoredUsers(); // Load users when module initializes

const simulateDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials) => {
    await simulateDelay();
    currentUsersList = getStoredUsers(); // Ensure we have the latest list
    const { email, password } = credentials;
    console.log('[AuthService-LS] Login attempt with:', email);

    // Special case for admin login - this admin might not be in the 'currentUsersList'
    // or could be. For simplicity, we can handle it distinctly or ensure it's in the list.
    if (email === 'admin@example.com' && password) { // Simple password check for mock admin
      const adminUser = currentUsersList.find(u => u.email === email && u.isAdmin);
      if (adminUser) {
        console.log('[AuthService-LS] Admin login successful from stored list:', adminUser);
        return Promise.resolve({ data: { user: { ...adminUser }, token: 'mock-admin-jwt-token-from-list' } });
      } else {
        // Fallback if admin is not in the list but credentials match the hardcoded admin
        const hardcodedAdminUser = {
            id: 'admin001',
            email: email,
            name: 'Admin User', // This name will be used if not found in stored list
            isAdmin: true,
        };
        console.log('[AuthService-LS] Admin login successful (hardcoded details):', hardcodedAdminUser);
        return Promise.resolve({ data: { user: hardcodedAdminUser, token: 'mock-admin-jwt-token' } });
      }
    }

    // For regular users
    const user = currentUsersList.find(u => u.email === email);

    // MOCK PASSWORD CHECK: For this localStorage "backend", we are not securely checking passwords.
    // If you stored plain passwords during register (not recommended, but for a pure LS mock):
    // if (user && user.password === password) { 
    // For now, just check if user email exists for non-admins
    if (user) {
      console.log(`[AuthService-LS] User found for login:`, user);
      // Return the user object from localStorage, which includes their potentially updated name
      return Promise.resolve({ data: { user: { ...user }, token: `mock-token-for-${user.id}` } });
    } else {
      console.log('[AuthService-LS] Mock login failed: user not found or credentials incorrect.');
      const error = new Error('Invalid credentials or user not found');
      return Promise.reject(error);
    }
  },

  register: async (userData) => {
    await simulateDelay();
    currentUsersList = getStoredUsers();
    const { name, email, password } = userData; 
    console.log('[AuthService-LS] Registration attempt for:', email);

    if (currentUsersList.find(u => u.email === email)) {
      console.log('[AuthService-LS] Registration failed: email already exists.');
      const error = new Error('Email already exists.');
      return Promise.reject(error);
    }

    if (name && email && password) {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        // password: password, // Again, avoid storing plain passwords if possible even in LS mock
        isAdmin: false,
      };
      currentUsersList.push(newUser);
      saveStoredUsers(currentUsersList);
      console.log('[AuthService-LS] Registration successful, user added to localStorage:', newUser);
      return Promise.resolve({ data: { ...newUser } });
    } else {
      console.log('[AuthService-LS] Registration failed: missing fields.');
      const error = new Error('Registration failed: missing fields');
      return Promise.reject(error);
    }
  },
};