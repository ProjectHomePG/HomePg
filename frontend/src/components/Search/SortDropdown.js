"use client";

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortDropdown component.
 * Offers dropdown options to sort listings (recommended, price ascending/descending, rating).
 */
export default function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-semibold text-slate-500">Sort By:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
      >
        <option value="DEFAULT">Recommended</option>
        <option value="PRICE_LOW_HIGH">Price: Low to High</option>
        <option value="PRICE_HIGH_LOW">Price: High to Low</option>
        <option value="RATING">Top Rated</option>
      </select>
    </div>
  );
}
