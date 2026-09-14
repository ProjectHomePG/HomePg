"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map, List, Compass, Search, X, RotateCcw, Building2 } from 'lucide-react';
import pgService from '../../services/pgService';
import FiltersSidebar from '../../components/Search/FiltersSidebar';
import SortDropdown from '../../components/Search/SortDropdown';
import PGGrid from '../../components/Search/PGGrid';
import MapView from '../../components/Search/MapView';
import Pagination from '../../components/Shared/Pagination';
import LoadingSkeleton from '../../components/Shared/LoadingSkeleton';

const POPULAR_CITIES = [
  'All',
  'Bangalore',
  'Delhi',
  'Mumbai',
  'Pune',
  'Gurugram',
  'Hyderabad',
  'Noida'
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary states
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapViewActive, setMapViewActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Search input state
  const initialQuery = searchParams.get('query') || '';
  const [searchInput, setSearchInput] = useState(initialQuery);

  // Filter variables reflecting URL params
  const [filters, setFilters] = useState({
    city: 'ALL',
    gender: 'ALL',
    sharing: 'ALL',
    minPrice: '',
    maxPrice: '',
    amenity: 'ALL',
    sortBy: 'DEFAULT'
  });

  const query = searchParams.get('query') || '';

  // Synchronize state with URL parameters on mount/update
  useEffect(() => {
    setSearchInput(searchParams.get('query') || '');
    setFilters({
      city: searchParams.get('city') || 'ALL',
      gender: searchParams.get('gender') || 'ALL',
      sharing: searchParams.get('sharing') || 'ALL',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      amenity: searchParams.get('amenity') || 'ALL',
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
        setCurrentPage(1);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, filters]);

  // Filter handlers updating URL
  const handleFilterChange = (newFilters, newQuery = query) => {
    const params = new URLSearchParams();
    if (newQuery && newQuery.trim()) params.set('query', newQuery.trim());
    if (newFilters.city && newFilters.city !== 'ALL') params.set('city', newFilters.city);
    if (newFilters.gender && newFilters.gender !== 'ALL') params.set('gender', newFilters.gender);
    if (newFilters.sharing && newFilters.sharing !== 'ALL') params.set('sharing', newFilters.sharing);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.amenity && newFilters.amenity !== 'ALL') params.set('amenity', newFilters.amenity);
    if (newFilters.sortBy && newFilters.sortBy !== 'DEFAULT') params.set('sortBy', newFilters.sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const handleCitySelect = (cityName) => {
    const targetCity = cityName === 'All' ? 'ALL' : cityName;
    handleFilterChange({ ...filters, city: targetCity });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange(filters, searchInput);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push('/search');
  };

  const removeFilterTag = (key) => {
    if (key === 'query') {
      setSearchInput('');
      handleFilterChange(filters, '');
    } else if (key === 'price') {
      handleFilterChange({ ...filters, minPrice: '', maxPrice: '' });
    } else {
      handleFilterChange({ ...filters, [key]: 'ALL' });
    }
  };

  // Pagination slicing
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pgs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pgs.length / itemsPerPage);

  // Determine active filter badges
  const activeBadges = [];
  if (query) activeBadges.push({ key: 'query', label: `Keyword: "${query}"` });
  if (filters.city && filters.city !== 'ALL') activeBadges.push({ key: 'city', label: `City: ${filters.city}` });
  if (filters.gender && filters.gender !== 'ALL') activeBadges.push({ key: 'gender', label: `Gender: ${filters.gender}` });
  if (filters.sharing && filters.sharing !== 'ALL') activeBadges.push({ key: 'sharing', label: `Room: ${filters.sharing}` });
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? `₹${filters.minPrice}` : '₹0';
    const max = filters.maxPrice ? `₹${filters.maxPrice}` : 'Any';
    activeBadges.push({ key: 'price', label: `${min} - ${max}` });
  }
  if (filters.amenity && filters.amenity !== 'ALL') activeBadges.push({ key: 'amenity', label: `Amenity: ${filters.amenity}` });

  return (
    <div className="space-y-6">
      {/* Search Header Info */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider block">
              Live Stays Catalog
            </span>
            <h1 className="text-xl font-black text-slate-850 dark:text-slate-100 mt-0.5">
              {query ? `PG Stays matching "${query}"` : 'All Verified PG Accommodations'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Found {pgs.length} verified co-living spaces
            </p>
          </div>

          {/* Search Bar Input in Header */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search PG name, city, area, metro..."
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-9 pr-20 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:border-primary-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* View Toggle (Map vs List) */}
          <div className="flex items-center space-x-3">
            <SortDropdown 
              sortBy={filters.sortBy} 
              onSortChange={(val) => handleFilterChange({ ...filters, sortBy: val })} 
            />
            <button
              onClick={() => setMapViewActive(!mapViewActive)}
              className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all cursor-pointer"
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

        {/* City Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 flex items-center">
            <Building2 className="w-3.5 h-3.5 mr-1 text-primary-500" />
            Cities:
          </span>
          {POPULAR_CITIES.map((cityName) => {
            const isSelected =
              (cityName === 'All' && (!filters.city || filters.city === 'ALL')) ||
              filters.city?.toLowerCase() === cityName.toLowerCase();
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => handleCitySelect(cityName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>

        {/* Active Filter Tags */}
        {activeBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
              Active:
            </span>
            {activeBadges.map((badge) => (
              <button
                key={badge.key}
                type="button"
                onClick={() => removeFilterTag(badge.key)}
                className="flex items-center px-2.5 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-900/60 rounded-lg text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer group"
              >
                <span>{badge.label}</span>
                <X className="w-3 h-3 ml-1.5 text-primary-400 group-hover:text-rose-500" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 ml-2 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
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
            <div className="bg-white dark:bg-slate-850 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                  No PG Accommodations Found
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any stays matching your current search criteria. Try removing some filters or searching for another PG name or city.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset All Filters
              </button>
            </div>
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
