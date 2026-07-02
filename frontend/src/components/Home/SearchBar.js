"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Users, IndianRupee } from 'lucide-react';

/**
 * SearchBar component for PG hunting.
 * Collects destination query, gender preferences, and budgets.
 */
export default function SearchBar({ initialValues = {} }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValues.query || '');
  const [gender, setGender] = useState(initialValues.gender || 'ALL');
  const [budget, setBudget] = useState(initialValues.maxPrice || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (gender !== 'ALL') params.set('gender', gender);
    if (budget) params.set('maxPrice', budget);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="w-full bg-white dark:bg-slate-800 rounded-2xl md:rounded-full shadow-lg p-3 md:p-2 border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row flex-wrap md:flex-nowrap items-stretch md:items-center justify-center gap-3 md:gap-1 max-w-5xl mx-auto"
    >
      {/* Location Input */}
      <div className="flex items-center px-4 py-2 flex-grow space-x-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
        <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Where to?</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, college, office, metro..."
            className="w-full text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0 p-0"
          />
        </div>
      </div>

      {/* Gender Type */}
      <div className="flex items-center px-4 py-2 md:w-48 space-x-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
        <Users className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="ALL">Any Gender</option>
            <option value="MALE">Male Only</option>
            <option value="FEMALE">Female Only</option>
            <option value="UNISEX">Co-Living / Unisex</option>
          </select>
        </div>
      </div>

      {/* Budget */}
      <div className="flex items-center px-4 py-2 md:w-44 space-x-3">
        <IndianRupee className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Max Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="">Any Budget</option>
            <option value="8000">₹8,000 / month</option>
            <option value="10000">₹10,000 / month</option>
            <option value="12000">₹12,000 / month</option>
            <option value="15000">₹15,000 / month</option>
            <option value="20000">₹20,000 / month</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-4 md:py-3.5 rounded-xl md:rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center shadow-md transition-all hover:shadow hover:scale-[1.02] cursor-pointer"
      >
        <Search className="w-5 h-5 mr-2 md:mr-0" />
        <span className="md:hidden">Search PG Accommodations</span>
      </button>
    </form>
  );
}
