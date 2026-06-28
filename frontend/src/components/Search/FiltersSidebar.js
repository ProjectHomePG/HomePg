"use client";

import React from 'react';
import { Filter, RotateCcw, Shield, ShieldCheck } from 'lucide-react';

/**
 * FiltersSidebar component.
 * Houses filtering criteria inputs (gender, room-sharing, budget levels, and amenities).
 */
export default function FiltersSidebar({ filters, onFilterChange, onReset }) {
  const handleGenderSelect = (gender) => {
    onFilterChange({ ...filters, gender });
  };

  const handleSharingSelect = (sharing) => {
    onFilterChange({ ...filters, sharing });
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center text-slate-850 dark:text-slate-100">
          <Filter className="w-4 h-4 mr-2 text-primary-500" />
          Filter Stays
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </button>
      </div>

      {/* Gender Restriction Category */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Gender Policy</label>
        <div className="grid grid-cols-2 gap-2">
          {['ALL', 'MALE', 'FEMALE', 'UNISEX'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderSelect(g)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filters.gender === g
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {g === 'ALL' ? 'Any Policy' : g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Room Sharing Type */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Room Sharing</label>
        <div className="grid grid-cols-2 gap-2">
          {['ALL', 'SINGLE', 'DOUBLE', 'TRIPLE'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSharingSelect(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filters.sharing === s
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {s === 'ALL' ? 'Any Sharing' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Limit Category */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Budget (₹)</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <span className="text-[10px] text-slate-400">Min Rent</span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleBudgetChange}
              placeholder="0"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none"
            />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-slate-400">Max Rent</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleBudgetChange}
              placeholder="Any"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Safety Badge */}
      <div className="p-4 bg-primary-50/50 dark:bg-slate-900 rounded-2xl border border-primary-100/50 dark:border-slate-800 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Verified Stays Only</span>
          <span className="text-[10px] text-slate-400">All locations undergo 10-point owner background checks.</span>
        </div>
      </div>
    </aside>
  );
}
