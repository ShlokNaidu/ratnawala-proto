import axios from 'axios';

// Base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token from localStorage automatically
api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem('ratnawala-auth') || '{}');
    const token = stored?.state?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* no-op */ }
  return config;
});

// Normalise error responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
