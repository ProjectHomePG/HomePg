"use client";

import React from 'react';
import { Filter, RotateCcw, ShieldCheck, X } from 'lucide-react';

/**
 * FiltersSidebar component.
 * Houses filtering criteria inputs (gender, room-sharing, budget levels, and amenities).
 */
export default function FiltersSidebar({ filters, onFilterChange, onReset }) {
  const activeFilterCount = [
    filters.gender !== 'ALL',
    filters.sharing !== 'ALL',
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

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

  const clearFilter = (key) => {
    const next = { ...filters };
    if (key === 'gender') next.gender = 'ALL';
    else if (key === 'sharing') next.sharing = 'ALL';
    else if (key === 'minPrice') next.minPrice = '';
    else if (key === 'maxPrice') next.maxPrice = '';
    onFilterChange(next);
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 space-y-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center text-slate-800 dark:text-slate-100">
          <Filter className="w-4 h-4 mr-2 text-primary-500" />
          Filter Stays
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </button>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.gender !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30">
              {filters.gender}
              <button onClick={() => clearFilter('gender')} className="cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.sharing !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30">
              {filters.sharing}
              <button onClick={() => clearFilter('sharing')} className="cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.minPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30">
              Min ₹{filters.minPrice}
              <button onClick={() => clearFilter('minPrice')} className="cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30">
              Max ₹{filters.maxPrice}
              <button onClick={() => clearFilter('maxPrice')} className="cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

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
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
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
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
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
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
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
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {[8000, 12000, 15000, 20000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onFilterChange({ ...filters, maxPrice: String(preset) })}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                String(filters.maxPrice) === String(preset)
                  ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 text-primary-600'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              ≤₹{preset >= 1000 ? `${preset / 1000}K` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Badge */}
      <div className="p-4 bg-primary-50/50 dark:bg-slate-900 rounded-2xl border border-primary-100/50 dark:border-slate-700 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Verified Stays Only</span>
          <span className="text-[10px] text-slate-400">All locations undergo 10-point owner background checks.</span>
        </div>
      </div>
    </aside>
  );
}
