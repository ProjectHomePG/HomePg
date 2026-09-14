"use client";

import React from 'react';
import { Filter, RotateCcw, ShieldCheck, Sparkles, Check } from 'lucide-react';

const AMENITY_OPTIONS = [
  "WiFi",
  "Air Conditioning",
  "3 Meals Daily",
  "Power Backup",
  "Housekeeping",
  "Gym",
  "Biometric Security",
  "Laundry Service",
  "CCTV Security"
];

const BUDGET_PRESETS = [
  { label: 'Under ₹8k', min: '', max: '8000' },
  { label: '₹8k - ₹12k', min: '8000', max: '12000' },
  { label: '₹12k - ₹16k', min: '12000', max: '16000' },
  { label: '₹16k+', min: '16000', max: '' }
];

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

  const handlePresetSelect = (min, max) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleAmenityToggle = (amenity) => {
    const current = filters.amenity === amenity ? 'ALL' : amenity;
    onFilterChange({ ...filters, amenity: current });
  };

  // Count active filters
  let activeCount = 0;
  if (filters.gender && filters.gender !== 'ALL') activeCount++;
  if (filters.sharing && filters.sharing !== 'ALL') activeCount++;
  if (filters.minPrice) activeCount++;
  if (filters.maxPrice) activeCount++;
  if (filters.amenity && filters.amenity !== 'ALL') activeCount++;

  return (
    <aside className="w-full bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-slate-100">
            Filter Stays
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-black bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </button>
        )}
      </div>

      {/* Gender Restriction Category */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Gender Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'ALL', label: 'Any Policy' },
            { id: 'MALE', label: 'Boys Only' },
            { id: 'FEMALE', label: 'Girls Only' },
            { id: 'UNISEX', label: 'Co-Living / Unisex' }
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleGenderSelect(g.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filters.gender === g.id
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Sharing Type */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Room Sharing Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'ALL', label: 'Any Sharing' },
            { id: 'SINGLE', label: 'Private (1 Room)' },
            { id: 'DOUBLE', label: '2 Sharing' },
            { id: 'TRIPLE', label: '3+ Sharing' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSharingSelect(s.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filters.sharing === s.id
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Limit Category */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Monthly Budget (₹)
        </label>

        {/* Quick presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {BUDGET_PRESETS.map((p, idx) => {
            const isSelected = filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p.min, p.max)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Min Rent</span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleBudgetChange}
              placeholder="₹0"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Max Rent</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleBudgetChange}
              placeholder="No limit"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Key Amenities</span>
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_OPTIONS.map((amenity) => {
            const isSelected = filters.amenity === amenity;
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 mr-1" />}
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Badge */}
      <div className="p-4 bg-primary-50/50 dark:bg-slate-900/60 rounded-2xl border border-primary-100/60 dark:border-slate-800 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Verified Listings</span>
          <span className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
            Owner ID verified, clear deposit rules, and 24/7 security.
          </span>
        </div>
      </div>
    </aside>
  );
}
