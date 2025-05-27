// src/api/axiosConfig.js
import axios from 'axios';

// In a real application, this would be your backend's base URL
// For now, it can be a placeholder or your local development URL for the backend if you know it.
// Example: const API_BASE_URL = 'http://localhost:6543/api/v1'; // Assuming Pyramid runs on 6543
const API_BASE_URL = '/api'; // Using a relative path for proxying or if served from same domain

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other common headers here, like Authorization tokens
  },
});

// Optional: Interceptors can be added here for handling requests or responses globally
// For example, to automatically add an auth token to requests:
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken'); // Example token storage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default apiClient;