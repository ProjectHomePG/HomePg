import api from './api';

export const pgService = {
  getAll: async () => {
    const response = await api.get('/pgs');
    return response.data;
  },

  search: async (query, filters = {}) => {
    const params = {};
    if (query && query.trim()) params.query = query.trim();
    if (filters.gender && filters.gender !== 'ALL') params.gender = filters.gender;
    if (filters.sharing && filters.sharing !== 'ALL') params.sharing = filters.sharing;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    const response = await api.get('/search', { params });
    let results = response.data;

    if (filters.sortBy && results && results.length > 0) {
      if (filters.sortBy === "PRICE_LOW_HIGH") {
        results.sort((a, b) => (a.priceTriple || a.priceDouble || a.price || 0) - (b.priceTriple || b.priceDouble || b.price || 0));
      } else if (filters.sortBy === "PRICE_HIGH_LOW") {
        results.sort((a, b) => (b.priceTriple || b.priceDouble || b.price || 0) - (a.priceTriple || a.priceDouble || a.price || 0));
      } else if (filters.sortBy === "RATING") {
        results.sort((a, b) => (b.rating || 5.0) - (a.rating || 5.0));
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
    const response = await api.post('/pgs', pgData);
    return response.data;
  },

  update: async (id, pgData) => {
    const response = await api.put(`/pgs/${id}`, pgData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pgs/${id}`);
    return response.data;
  },

  submitInquiry: async (inquiryData) => {
    const response = await api.post('/inquiries', inquiryData);
    return response.data;
  },

  addFavorite: async (pgId) => {
    const response = await api.post(`/favorites/${pgId}`);
    return response.data;
  },

  removeFavorite: async (pgId) => {
    const response = await api.delete(`/favorites/${pgId}`);
    return response.data;
  },

  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.warn("Get favorites API failed:", error.message);
      return [];
    }
  },

  checkFavoriteStatus: async (pgId) => {
    try {
      const response = await api.get(`/favorites/${pgId}/status`);
      return response.data.isFavorite;
    } catch (error) {
      console.warn("Check favorite status API failed:", error.message);
      return false;
    }
  },

  getMyPGs: async () => {
    try {
      const response = await api.get('/owner/pgs');
      return response.data;
    } catch (error) {
      console.warn("Get my PGs API failed:", error.message);
      return [];
    }
  },

  createMyPG: async (pgData) => {
    const response = await api.post('/owner/pgs', pgData);
    return response.data;
  },

  updateMyPG: async (pgId, pgData) => {
    const response = await api.put(`/owner/pgs/${pgId}`, pgData);
    return response.data;
  },

  deleteMyPG: async (pgId) => {
    const response = await api.delete(`/owner/pgs/${pgId}`);
    return response.data;
  }
};

export default pgService;
