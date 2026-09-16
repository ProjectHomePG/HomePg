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

  const handleResetAll = () => {
    setSearchInput('');
    router.push('/search');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pgs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pgs.length / itemsPerPage);

  const hasActiveFilters = query || filters.gender !== 'ALL' || filters.sharing !== 'ALL' || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-6">
      {/* Search Input Bar - only visible when no active query */}
      {!query && (
        <form onSubmit={handleSearchSubmit} className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center p-2 gap-2">
          <div className="flex items-center flex-1 px-4 gap-3">
            <Search className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by city, area, PG name, landmark..."
              className="w-full text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0 p-2"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-sm transition-all cursor-pointer flex-shrink-0"
          >
            Search
          </button>
        </form>
      )}

      {/* Search Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider block">Search Results</span>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {query ? `PGs near "${query}"` : 'All PG Accommodations'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Found {pgs.length} verified co-living {pgs.length === 1 ? 'stay' : 'stays'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SortDropdown 
            sortBy={filters.sortBy} 
            onSortChange={(val) => handleFilterChange({ ...filters, sortBy: val })} 
          />
          <button
            onClick={() => setMapViewActive(!mapViewActive)}
            className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all cursor-pointer"
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
            <LoadingSkeleton type="GRID" count={9} />
          ) : pgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No results found</h3>
              <p className="text-xs text-slate-400 text-center max-w-sm mb-4">
                We couldn&apos;t find any PG accommodations matching your criteria. Try adjusting your filters or search query.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : mapViewActive ? (
            <div className="space-y-6">
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
      <div className="w-full text-center py-12 text-sm font-semibold text-slate-500 animate-pulse">
        <Compass className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-2" />
        Searching accommodations...
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
