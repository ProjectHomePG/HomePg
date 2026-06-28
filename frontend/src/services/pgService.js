import api from './api';

const getCurrentUserObject = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const pgService = {
  getAll: async () => {
    const response = await api.get('/pgs');
    return response.data;
  },

  search: async (query, filters = {}) => {
    const params = {};
    if (query) params.query = query;
    if (filters.gender && filters.gender !== "ALL") params.gender = filters.gender;
    if (filters.sharing && filters.sharing !== "ALL") params.sharing = filters.sharing;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    const response = await api.get('/search', { params });
    let results = response.data;
    
    // Sort results on the client side
    if (filters.sortBy) {
      if (filters.sortBy === "PRICE_LOW_HIGH") {
        results.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "PRICE_HIGH_LOW") {
        results.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === "RATING") {
        results.sort((a, b) => b.rating - a.rating);
      }
    }
    return results;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/pgs/slug/${slug}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/pgs/${id}`);
    return response.data;
  },

  create: async (pgData) => {
    const user = getCurrentUserObject();
    const slug = pgData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random() * 1000);
    
    const payload = {
      title: pgData.title,
      description: pgData.description,
      slug: slug,
      address: pgData.address,
      city: pgData.city,
      state: pgData.state,
      zipCode: pgData.zipCode,
      price: Number(pgData.price),
      rules: pgData.rules,
      genderType: pgData.genderType,
      sharingType: pgData.sharingType,
      owner: user ? { id: user.id } : { id: 1 }
    };

    const response = await api.post('/pgs', payload);
    return response.data;
  },

  update: async (id, pgData) => {
    const user = getCurrentUserObject();
    const slug = pgData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      title: pgData.title,
      description: pgData.description,
      slug: slug,
      address: pgData.address,
      city: pgData.city,
      state: pgData.state,
      zipCode: pgData.zipCode,
      price: Number(pgData.price),
      rules: pgData.rules,
      genderType: pgData.genderType,
      sharingType: pgData.sharingType,
      owner: user ? { id: user.id } : { id: 1 }
    };

    const response = await api.put(`/pgs/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pgs/${id}`);
    return response.data;
  },

  submitInquiry: async (inquiryData) => {
    const response = await api.post('/inquiries', {
      pgId: inquiryData.pgId,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      message: inquiryData.message
    });
    return response.data;
  }
};

export default pgService;
