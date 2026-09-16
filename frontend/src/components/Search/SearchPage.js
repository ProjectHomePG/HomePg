"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Search, MapPin } from 'lucide-react';
import pgService from '@/services/pgService';
import FiltersSidebar from './FiltersSidebar';
import PGGrid from './PGGrid';
import LoadingSkeleton from '../Shared/LoadingSkeleton';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    query: '',
    city: 'ALL',
    gender: 'ALL',
    sharing: 'ALL',
    minPrice: '',
    maxPrice: '',
    amenity: 'ALL',
    sortBy: 'RELEVANCE'
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (searchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pgService.search(
        searchFilters.query || '',
        searchFilters.city === 'ALL' ? '' : searchFilters.city,
        searchFilters.gender === 'ALL' ? '' : searchFilters.gender,
        searchFilters.sharing === 'ALL' ? '' : searchFilters.sharing,
        searchFilters.minPrice || '',
        searchFilters.maxPrice || '',
        searchFilters.amenity === 'ALL' ? '' : searchFilters.amenity
      );
      setResults(data || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - fetch all PGs
  useEffect(() => {
    performSearch(filters);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    performSearch(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      query: '',
      city: 'ALL',
      gender: 'ALL',
      sharing: 'ALL',
      minPrice: '',
      maxPrice: '',
      amenity: 'ALL',
      sortBy: 'RELEVANCE'
    };
    setFilters(defaultFilters);
    performSearch(defaultFilters);
  };

  const handleQueryChange = (e) => {
    const newFilters = { ...filters, query: e.target.value };
    setFilters(newFilters);
  };

  const handleQuerySubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      performSearch(filters);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 text-white">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4">Find Your Perfect PG</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2 bg-white rounded-2xl p-3 shadow-lg">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0 my-auto" />
          <input
            type="text"
            placeholder="Search by name, location, or amenities..."
            value={filters.query}
            onChange={handleQueryChange}
            onKeyPress={handleQuerySubmit}
            className="flex-1 outline-none bg-transparent text-slate-800 text-sm placeholder-slate-400"
          />
          <button
            onClick={handleQuerySubmit}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FiltersSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Main Results */}
        <div className="lg:col-span-3">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100">
                {searchPerformed ? `${results.length} Results Found` : 'Browse All Stays'}
              </h2>
              {filters.query && (
                <p className="text-sm text-slate-400 mt-1">
                  Searching for "<strong>{filters.query}</strong>"
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <LoadingSkeleton type="GRID" count={6} />
          ) : results.length > 0 ? (
            <>
              <PGGrid pgs={results} />
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
              <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200 mb-2">
                No Results Found
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={handleReset}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-semibold text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
