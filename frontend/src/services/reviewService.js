import api from './api';

const MOCK_REVIEWS = {
  1: [
    { id: 101, user: "Rohan Das", rating: 5, comment: "Absolutely loved the environment! The food is hygienic and tastes like home. Very close to Manyata Gate 5.", createdAt: "2026-05-15T12:00:00Z" },
    { id: 102, user: "Kunal Shah", rating: 4, comment: "Housekeeping is top-notch. WiFi speed is great for WFH. Highly recommended boys PG.", createdAt: "2026-06-01T08:30:00Z" }
  ],
  2: [
    { id: 201, user: "Priya Menon", rating: 5, comment: "Extremely secure place with biometric locks. Walking distance to NIFT. Rooms are spacious and tidy.", createdAt: "2026-04-10T14:20:00Z" },
    { id: 202, user: "Anjali Rao", rating: 4, comment: "Nice environment. Food is good on most days. Host is very responsive to inquiries.", createdAt: "2026-05-20T09:15:00Z" }
  ],
  3: [
    { id: 301, user: "Vikram Sen", rating: 5, comment: "The gaming zone and weekly events are awesome. Feels more like a community co-living space than a PG.", createdAt: "2026-06-10T11:00:00Z" }
  ],
  4: [
    { id: 401, user: "Manish Kumar", rating: 4, comment: "Best budget friendly option for DU students. Rooms are clean, food is decent, and Kamla Nagar market is nearby.", createdAt: "2026-06-12T16:40:00Z" }
  ]
};

export const reviewService = {
  getByPgId: async (pgId) => {
    try {
      const response = await api.get(`/reviews/pg/${pgId}`);
      return response.data;
    } catch (error) {
      console.warn("Reviews API failed, using mock reviews:", error);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_REVIEWS[pgId] || [];
    }
  },

  addReview: async (pgId, rating, comment, userId, username) => {
    try {
      const response = await api.post('/reviews', {
        pgId: Number(pgId),
        userId: Number(userId),
        rating: Number(rating),
        comment
      });
      return response.data;
    } catch (error) {
      console.warn("Add Review API failed, using mock fallback:", error);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newReview = {
        id: Math.floor(Math.random() * 1000) + 500,
        user: username || "Anonymous Guest",
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString()
      };

      if (!MOCK_REVIEWS[pgId]) {
        MOCK_REVIEWS[pgId] = [];
      }
      MOCK_REVIEWS[pgId].unshift(newReview);
      return newReview;
    }
  }
};

export default reviewService;
