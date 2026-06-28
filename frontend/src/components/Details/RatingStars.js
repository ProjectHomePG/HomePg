import React from 'react';
import { Star } from 'lucide-react';

/**
 * RatingStars component.
 * Renders rating stars up to 5 based on a numeric value.
 */
export default function RatingStars({ rating, size = 4 }) {
  const roundedRating = Math.round(rating);
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= roundedRating
              ? 'text-amber-500 fill-amber-500'
              : 'text-slate-200 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  );
}
