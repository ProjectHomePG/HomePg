"use client";

import React from 'react';
import { Star } from 'lucide-react';
import AdminHeader from '../../../components/Admin/AdminHeader';
import RatingStars from '../../../components/Details/RatingStars';

/**
 * AdminReviewsPage component.
 * Moderates client reviews posted on listed stays.
 */
export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Review Moderation" 
        subtitle="Approve, flag, or remove customer comments posted on properties." 
      />

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 shadow-sm text-center space-y-4">
        <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No reviews submitted yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Customer feedback will appear here for review once occupants start submitting it.
          </p>
        </div>
        <RatingStars rating={0} size={4} />
      </div>
    </div>
  );
}
