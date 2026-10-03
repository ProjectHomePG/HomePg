"use client";

import React, { useState } from 'react';
import { Filter, RotateCcw, X, ChevronDown, ChevronUp } from 'lucide-react';

const AMENITIES_LIST = [
  { id: 'WiFi', label: 'WiFi' },
  { id: 'AC', label: 'AC' },
  { id: 'Food', label: 'Food Included' },
  { id: 'Power Backup', label: 'Power Backup' },
  { id: 'Gym', label: 'Gym' }
];

export default function FiltersSidebar({ filters, onFilterChange, onReset }) {
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(true);

  const activeFilterCount = [
    filters.gender !== 'ALL',
    filters.sharing !== 'ALL',
    filters.minPrice,
    filters.maxPrice,
    filters.amenity && filters.amenity !== 'ALL'
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

  const handleAmenityToggle = (amenityId) => {
    const newAmenity = filters.amenity === amenityId ? 'ALL' : amenityId;
    onFilterChange({ ...filters, amenity: newAmenity });
  };

  const clearFilter = (key) => {
    const next = { ...filters };
    if (key === 'gender') next.gender = 'ALL';
    else if (key === 'sharing') next.sharing = 'ALL';
    else if (key === 'minPrice') next.minPrice = '';
    else if (key === 'maxPrice') next.maxPrice = '';
    else if (key === 'amenity') next.amenity = 'ALL';
    onFilterChange(next);
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 space-y-8 shadow-md sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-base uppercase tracking-wider flex items-center text-slate-800 dark:text-slate-100">
          <Filter className="w-5 h-5 mr-2 text-primary-500" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-primary-600 text-white rounded-full shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={onReset}
          className="text-sm font-semibold text-slate-400 hover:text-rose-500 flex items-center transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.gender !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30 transition-all hover:bg-primary-100">
              {filters.gender}
              <button onClick={() => clearFilter('gender')} className="cursor-pointer hover:text-primary-800"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.sharing !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30 transition-all hover:bg-primary-100">
              {filters.sharing}
              <button onClick={() => clearFilter('sharing')} className="cursor-pointer hover:text-primary-800"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.minPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30 transition-all hover:bg-primary-100">
              Min ₹{filters.minPrice}
              <button onClick={() => clearFilter('minPrice')} className="cursor-pointer hover:text-primary-800"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30 transition-all hover:bg-primary-100">
              Max ₹{filters.maxPrice}
              <button onClick={() => clearFilter('maxPrice')} className="cursor-pointer hover:text-primary-800"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
          {filters.amenity && filters.amenity !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/30 transition-all hover:bg-primary-100">
              {filters.amenity}
              <button onClick={() => clearFilter('amenity')} className="cursor-pointer hover:text-primary-800"><X className="w-3.5 h-3.5" /></button>
            </span>
          )}
        </div>
      )}

      {/* Gender Restriction Category */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">Who is looking?</label>
        <div className="grid grid-cols-2 gap-3">
          {['ALL', 'MALE', 'FEMALE', 'UNISEX'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderSelect(g)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer ${
                filters.gender === g
                  ? 'bg-primary-600 border-primary-600 text-white shadow-md transform scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
            >
              {g === 'ALL' ? 'Anyone' : g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Room Sharing Type */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">Room Sharing</label>
        <div className="grid grid-cols-2 gap-3">
          {['ALL', 'SINGLE', 'DOUBLE', 'TRIPLE'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSharingSelect(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border cursor-pointer ${
                filters.sharing === s
                  ? 'bg-primary-600 border-primary-600 text-white shadow-md transform scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'
              }`}
            >
              {s === 'ALL' ? 'Any Sharing' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Limit Category */}
      <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">Monthly Budget (₹)</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleBudgetChange}
              placeholder="Min"
              className="w-full bg-white dark:bg-slate-900 text-sm font-semibold pl-8 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
            />
          </div>
          <span className="text-slate-400 font-bold">-</span>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleBudgetChange}
              placeholder="Max"
              className="w-full bg-white dark:bg-slate-900 text-sm font-semibold pl-8 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {[8000, 12000, 15000, 20000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onFilterChange({ ...filters, maxPrice: String(preset) })}
              className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                String(filters.maxPrice) === String(preset)
                  ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Up to {preset >= 1000 ? `${preset / 1000}K` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Category */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-700 pt-5">
        <button 
          onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)}
          className="w-full flex items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          Popular Amenities
          {isAmenitiesOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        
        {isAmenitiesOpen && (
          <div className="flex flex-wrap gap-2 pt-2">
            {AMENITIES_LIST.map((amenity) => (
              <button
                key={amenity.id}
                type="button"
                onClick={() => handleAmenityToggle(amenity.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  filters.amenity === amenity.id
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {amenity.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
