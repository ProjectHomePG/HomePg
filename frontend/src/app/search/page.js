"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map, List, Compass, RefreshCw } from 'lucide-react';
import pgService from '../../services/pgService';
import FiltersSidebar from '../../components/Search/FiltersSidebar';
import SortDropdown from '../../components/Search/SortDropdown';
import PGGrid from '../../components/Search/PGGrid';
import MapView from '../../components/Search/MapView';
import Pagination from '../../components/Shared/Pagination';
import LoadingSkeleton from '../../components/Shared/LoadingSkeleton';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary states
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapViewActive, setMapViewActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter variables reflecting URL params
  const [filters, setFilters] = useState({
    gender: 'ALL',
    sharing: 'ALL',
    minPrice: '',
    maxPrice: '',
    sortBy: 'DEFAULT'
  });

  const query = searchParams.get('query') || '';

  // Synchronize state with URL parameters on mount/update
  useEffect(() => {
    setFilters({
      gender: searchParams.get('gender') || 'ALL',
      sharing: searchParams.get('sharing') || 'ALL',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'DEFAULT'
    });
  }, [searchParams]);

  // Load searched and filtered data
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const results = await pgService.search(query, filters);
        setPgs(results);
        setCurrentPage(1); // Reset page on filter update
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, filters]);

  // Filter handlers updating URL
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (newFilters.gender !== 'ALL') params.set('gender', newFilters.gender);
    if (newFilters.sharing !== 'ALL') params.set('sharing', newFilters.sharing);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortBy !== 'DEFAULT') params.set('sortBy', newFilters.sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    router.push(`/search?${params.toString()}`);
  };

  // Pagination slicing
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pgs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pgs.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Search Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-750 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider block">Search Results</span>
          <h1 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-0.5">
            {query ? `PGs near "${query}"` : 'All PG Accommodations'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Found {pgs.length} verified co-living stays</p>
        </div>

        {/* View Toggle (Map vs List) */}
        <div className="flex items-center space-x-3">
          <SortDropdown 
            sortBy={filters.sortBy} 
            onSortChange={(val) => handleFilterChange({ ...filters, sortBy: val })} 
          />
          <button
            onClick={() => setMapViewActive(!mapViewActive)}
            className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all cursor-pointer"
          >
            {mapViewActive ? (
              <>
                <List className="w-4 h-4 mr-1.5 text-primary-500" />
                Show List
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-1.5 text-primary-500" />
                Show Map
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FiltersSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleResetFilters} 
          />
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingSkeleton type="GRID" count={3} />
          ) : mapViewActive ? (
            <div className="space-y-6">
              <MapView pgs={pgs} height="h-[500px]" />
              <PGGrid pgs={currentItems} />
            </div>
          ) : (
            <PGGrid pgs={currentItems} />
          )}

          {/* Pagination */}
          {!loading && pgs.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full text-center py-12 text-sm font-semibold text-slate-500 animate-pulse">
        <Compass className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-2" />
        Searching accommodations...
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
