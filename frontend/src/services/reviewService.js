import api from './api';

export const reviewService = {
  getByPgId: async (pgId) => {
    try {
      const response = await api.get(`/reviews/pg/${pgId}`);
      return response.data;
    } catch (error) {
      console.warn("Reviews API failed:", error);
      return [];
    }
  }
};

export default reviewService;
