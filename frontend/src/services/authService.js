import api from './api';

// For placeholder demo mode, we simulate server authentication
const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ROLE_USER', // ROLE_USER, ROLE_OWNER, ROLE_ADMIN
  phone: '+1 234 567 890'
};

const MOCK_OWNER = {
  id: 2,
  name: 'Jane Proprietor',
  email: 'owner@example.com',
  role: 'ROLE_OWNER',
  phone: '+1 987 654 321'
};

const MOCK_ADMIN = {
  id: 3,
  name: 'Super Admin',
  email: 'admin@example.com',
  role: 'ROLE_ADMIN',
  phone: '+1 111 222 333'
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.warn("Authentication API failed, falling back to mock authentication:", error);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Simple mock logic for testing out the layout roles
      let user = MOCK_USER;
      if (email.includes('owner')) {
        user = MOCK_OWNER;
      } else if (email.includes('admin')) {
        user = MOCK_ADMIN;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'mock-jwt-token-xyz');
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    }
  },

  register: async (name, email, password, phone, role = 'ROLE_USER') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone, role });
      const user = response.data;
      
      // Attempt login to acquire token automatically
      try {
        const loginResponse = await api.post('/auth/login', { email, password });
        const { token } = loginResponse.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (loginErr) {
        console.warn("Automatic login failed post-registration, but registration succeeded:", loginErr);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', 'mock-jwt-token-new');
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      return user;
    } catch (error) {
      console.warn("Registration API failed, falling back to mock registration:", error);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        name,
        email,
        role,
        phone
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'mock-jwt-token-new');
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return newUser;
    }
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return true;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
    return false;
  }
};

export default authService;
