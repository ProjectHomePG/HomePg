"use client";

import React, { useState } from 'react';
import { Star, ShieldAlert, Trash2 } from 'lucide-react';
import AdminHeader from '../../../components/Admin/AdminHeader';
import RatingStars from '../../../components/Details/RatingStars';

const MOCK_MOD_REVIEWS = [
  { id: 501, user: "Rohan Das", pgTitle: "Stanza Living Dublin House", rating: 5, comment: "Absolutely loved the environment! The food is hygienic and tastes like home. Very close to Manyata Gate 5.", flag: false },
  { id: 502, user: "Kunal Shah", pgTitle: "Stanza Living Dublin House", rating: 4, comment: "Housekeeping is top-notch. WiFi speed is great for WFH. Highly recommended boys PG.", flag: false },
  { id: 503, user: "Spam User", pgTitle: "CoHo Premium Unisex Living", rating: 1, comment: "Worst PG ever!!! Fake prices don't stay here, absolute scam! visit my website spam.com", flag: true }
];

/**
 * AdminReviewsPage component.
 * Moderates client reviews posted on listed stays.
 */
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_MOD_REVIEWS);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this review?")) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Review Moderation" 
        subtitle="Approve, flag, or remove customer comments posted on properties." 
      />

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div 
            key={rev.id}
            className={`bg-white dark:bg-slate-800 border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              rev.flag ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10' : 'border-slate-100 dark:border-slate-800'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-3 flex-wrap gap-1">
                <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-200">{rev.user}</h4>
                <span className="text-[10px] text-slate-400">on {rev.pgTitle}</span>
                {rev.flag && (
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Flagged for Spam
                  </span>
                )}
              </div>

              <RatingStars rating={rev.rating} size={3.5} />
              
              <p className="text-xs text-slate-650 dark:text-slate-350 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <button
              onClick={() => handleDelete(rev.id)}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-bold flex items-center w-fit cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
