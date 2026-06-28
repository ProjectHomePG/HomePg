import React from 'react';
import RatingStars from './RatingStars';

/**
 * ReviewCard component.
 * Displays individual reviewer avatar, name, star rating, creation date, and comment.
 */
export default function ReviewCard({ review }) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
      {/* Reviewer Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 text-primary-600 dark:text-rose-400 font-bold flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
            {review.user.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{review.user}</h4>
            <span className="text-[10px] text-slate-400 block">{formattedDate}</span>
          </div>
        </div>
        
        {/* Stars */}
        <RatingStars rating={review.rating} size={4} />
      </div>

      {/* Review Comment text */}
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
        "{review.comment}"
      </p>
    </div>
  );
}
