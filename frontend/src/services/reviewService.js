import api from './api';

export const reviewService = {
  getByPgId: async (pgId) => {
    const response = await api.get(`/reviews/pg/${pgId}`);
    return response.data;
  },

  addReview: async (pgId, rating, comment, username) => {
    let userId = null;
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id;
      }
    }
    if (!userId) userId = 1; // Fallback to user ID 1 if not logged in

    const response = await api.post('/reviews', {
      pgId,
      userId,
      rating,
      comment
    });
    return response.data;
  }
};

export default reviewService;
