"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Clock, MapPin } from 'lucide-react';
import pgService from '../services/pgService';
import HeroSection from '../components/Home/HeroSection';
import SearchSuggestions from '../components/Home/SearchSuggestions';
import PGGrid from '../components/Search/PGGrid';
import LoadingSkeleton from '../components/Shared/LoadingSkeleton';

const NEARBY_RADIUS_KM = 50;
const LISTING_COUNT = 6;

/** Great-circle distance between two coordinates, in kilometres. */
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Unbiased in-place shuffle copy (Fisher-Yates). */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Home page for PG Near Me.
 * Integrates premium Hero banner, categories, and PG listings.
 */
export default function HomePage() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await pgService.getAll();
        setPgs(data);
      } catch (err) {
        console.error("Failed to load PGs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }),
      () => setCoords(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  const featuredPgs = pgs.slice(0, 6);

  const nearbyPgs = useMemo(() => {
    if (!coords) return [];
    return pgs
      .filter((pg) => typeof pg.latitude === 'number' && typeof pg.longitude === 'number')
      .map((pg) => ({
        pg,
        distance: distanceKm(coords.lat, coords.lng, pg.latitude, pg.longitude)
      }))
      .filter((entry) => entry.distance <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, LISTING_COUNT)
      .map((entry) => entry.pg);
  }, [coords, pgs]);

  const randomPgs = useMemo(() => shuffle(pgs).slice(0, LISTING_COUNT), [pgs]);

  const isNearbyMode = nearbyPgs.length > 0;
  const sectionPgs = isNearbyMode ? nearbyPgs : randomPgs;

  return (
    <div className="space-y-20 lg:space-y-32">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Category Suggestions (Tech Parks, Colleges) */}
      <section className="relative">
        <SearchSuggestions />
      </section>

      {/* 3. Value Proposition Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 border border-slate-100 dark:border-slate-800 shadow-soft">
        <div className="flex flex-col items-start space-y-4 md:pr-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <Building2 className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Premium Co-Living</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Zero hassle setups including 3-time meals, high-speed WiFi, and professional daily cleaning.</p>
          </div>
        </div>

        <div className="flex flex-col items-start space-y-4 md:pl-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-8 md:pt-0">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100 dark:border-rose-800/30">
            <MapPin className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Near Transit Hubs</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Strategic locations within walkable distance to metro lines, tech parks, and major universities.</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Listings */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-2">Editor's Choice</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center">
              Featured Stays
              <Sparkles className="w-6 h-6 ml-3 text-primary-500 animate-pulse" />
            </h2>
          </div>
          <Link href="/search" className="hidden sm:inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
            View All Stays
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="GRID" count={6} />
        ) : (
          <PGGrid pgs={featuredPgs} />
        )}
        
        <div className="sm:hidden flex justify-center mt-6">
          <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold w-full">
            View All Stays
          </Link>
        </div>
      </section>

      {/* 5. Nearby / Random Picks */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block mb-2">
              {isNearbyMode ? 'Near You' : 'New Listings'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center">
              {isNearbyMode ? 'PGs Near You' : 'Recently Added'}
              {isNearbyMode ? (
                <MapPin className="w-6 h-6 ml-3 text-primary-500" />
              ) : (
                <Clock className="w-6 h-6 ml-3 text-slate-400" />
              )}
            </h2>
          </div>
          <Link href="/search" className="hidden sm:inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
            Explore All
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="GRID" count={6} />
        ) : (
          <PGGrid pgs={sectionPgs} />
        )}
      </section>
    </div>
  );
}
