import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  register: async (name, email, password, phone, role = 'ROLE_USER') => {
    const response = await api.post('/auth/register', { name, email, password, phone, role });
    const user = response.data;

    const loginResponse = await api.post('/auth/login', { email, password });
    const { token } = loginResponse.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
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
      const token = localStorage.getItem('token');
      return token !== null && !token.startsWith('mock-');
    }
    return false;
  }
};

export default authService;
