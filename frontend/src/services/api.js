import axios from 'axios';

// Determine API base URL based on environment
const getApiUrl = () => {
  // Browser environment (Next.js Client Component)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083/api';
  }
  
  // SSR/Node.js environment
  // In Docker, use container name; locally use localhost
  const isDocker = process.env.DOCKER_ENVIRONMENT === 'true';
  if (isDocker) {
    return 'http://livio-backend:8083/api';
  }
  return process.env.INTERNAL_API_URL || 'http://localhost:8083/api';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
