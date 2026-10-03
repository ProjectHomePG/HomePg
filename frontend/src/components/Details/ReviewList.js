"use client";

import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import RatingStars from './RatingStars';
import reviewService from '../../services/reviewService';

/**
 * ReviewList component.
 * Displays overall rating metrics and list of review cards.
 */
export default function ReviewList({ pgId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [pgId]);

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
            <span className="text-xs text-slate-500 dark:text-slate-400 block">{reviews.length} reviews</span>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No reviews yet for this accommodation.</p>
        ) : (
          reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))
        )}
      </div>
    </div>
  );
}
