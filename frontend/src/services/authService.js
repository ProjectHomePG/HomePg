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
  },

  register: async (name, email, password, phone, role = 'ROLE_USER') => {
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
