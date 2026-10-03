"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map, List, Compass, RefreshCw, SearchX, Search } from 'lucide-react';
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

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapViewActive, setMapViewActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [filters, setFilters] = useState({
    gender: 'ALL',
    sharing: 'ALL',
    minPrice: '',
    maxPrice: '',
    sortBy: 'DEFAULT'
  });

  const query = searchParams.get('query') || '';
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setFilters({
      gender: searchParams.get('gender') || 'ALL',
      sharing: searchParams.get('sharing') || 'ALL',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'DEFAULT'
    });
  }, [searchParams]);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const results = await pgService.search(query, filters);
        setPgs(results);
        setCurrentPage(1);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, filters]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('query', searchInput.trim());
    if (filters.gender !== 'ALL') params.set('gender', filters.gender);
    if (filters.sharing !== 'ALL') params.set('sharing', filters.sharing);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy !== 'DEFAULT') params.set('sortBy', filters.sortBy);
    router.push(`/search?${params.toString()}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pgs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pgs.length / itemsPerPage);

  const hasActiveFilters = query || filters.gender !== 'ALL' || filters.sharing !== 'ALL' || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-8">
      {/* Search Input Bar - only visible when no active query */}
      {!query && (
        <form onSubmit={handleSearchSubmit} className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-soft border border-slate-200 dark:border-slate-800 flex items-center p-3 gap-3 transition-shadow focus-within:shadow-lg focus-within:border-primary-500">
          <div className="flex items-center flex-1 px-4 gap-4">
            <Search className="w-6 h-6 text-primary-500 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by city, area, PG name, landmark..."
              className="w-full text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0 p-2"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-500/25 transition-all cursor-pointer flex-shrink-0"
          >
            Search
          </button>
        </form>
      )}

      {/* Search Header Info */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-2">Search Results</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            {query ? `PGs near "${query}"` : 'All PG Accommodations'}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            Found {pgs.length} verified co-living {pgs.length === 1 ? 'stay' : 'stays'} matching your criteria
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <SortDropdown 
            sortBy={filters.sortBy} 
            onSortChange={(val) => handleFilterChange({ ...filters, sortBy: val })} 
          />
          <button
            onClick={() => setMapViewActive(!mapViewActive)}
            className="flex items-center px-5 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all cursor-pointer"
          >
            {mapViewActive ? (
              <>
                <List className="w-5 h-5 mr-2 text-primary-500" />
                List View
              </>
            ) : (
              <>
                <Map className="w-5 h-5 mr-2 text-primary-500" />
                Map View
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FiltersSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleResetFilters} 
          />
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <LoadingSkeleton type="GRID" count={9} />
          ) : pgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-soft">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <SearchX className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                We couldn&apos;t find any PG accommodations matching your criteria. Try adjusting your filters or search query to find more stays.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : mapViewActive ? (
            <div className="space-y-8">
              <MapView pgs={pgs} height="h-[500px]" />
              <PGGrid pgs={currentItems} />
            </div>
          ) : (
            <PGGrid pgs={currentItems} />
          )}

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
      <div className="w-full text-center py-20 text-base font-bold text-slate-500 flex flex-col items-center">
        <Compass className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        Discovering perfect stays...
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
