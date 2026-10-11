import { supabase } from '../lib/supabase';

export const reviewService = {
  getByPgId: async (pgId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, user:profiles(id, name)')
        .eq('pg_id', pgId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []).map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        user: review.user,
      }));
    } catch (error) {
      console.warn('Reviews fetch failed:', error);
      return [];
    }
  },
};

export default reviewService;
