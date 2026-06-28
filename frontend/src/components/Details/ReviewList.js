"use client";

import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import RatingStars from './RatingStars';
import reviewService from '../../services/reviewService';
import authService from '../../services/authService';

/**
 * ReviewList component.
 * Displays overall rating metrics, list of review cards, and dynamic submit form.
 */
export default function ReviewList({ pgId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await reviewService.getByPgId(pgId);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
    setCurrentUser(authService.getCurrentUser());
  }, [pgId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const username = currentUser ? currentUser.name : "Anonymous Guest";
      const newReview = await reviewService.addReview(pgId, rating, comment, username);
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (loading) {
    return <div className="text-sm font-semibold text-slate-500 animate-pulse py-4">Loading feedback...</div>;
  }

  // Calculate average rating dynamically
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Customer Feedback</h3>
          <p className="text-xs text-slate-400 mt-1">Real ratings submitted by verified occupants.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 block">{avgRating}</span>
            <span className="text-[10px] text-slate-405 block uppercase tracking-wider font-bold">Average rating</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-700 pl-4 space-y-1">
            <RatingStars rating={Number(avgRating)} size={4} />
            <span className="text-xs text-slate-500 dark:text-slate-450 block">{reviews.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No reviews written for this accommodation yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))
        )}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmitReview} className="p-6 bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Leave a Review</h4>
        
        {/* Rating Select */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500">Your Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-amber-500 focus:outline-none cursor-pointer"
              >
                <span className={`text-xl ${star <= rating ? 'opacity-100' : 'opacity-30'}`}>★</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your stay, food quality, hygiene standards..."
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-900 text-sm font-medium p-4 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:border-primary-500 transition-colors resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Post Review
        </button>
      </form>
    </div>
  );
}
