import axios from 'axios';

// In browser environment, use relative path '/api' so Next.js rewrites proxy to backend.
// In SSR (Node.js) environment, use direct localhost backend URL.
const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '/api')
  : (process.env.INTERNAL_API_URL || 'http://localhost:8083/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to inject JWT token from localStorage if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
