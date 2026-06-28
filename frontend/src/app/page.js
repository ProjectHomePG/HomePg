"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Clock, ShieldCheck, MapPin } from 'lucide-react';
import pgService from '../services/pgService';
import HeroSection from '../components/Home/HeroSection';
import SearchSuggestions from '../components/Home/SearchSuggestions';
import PGGrid from '../components/Search/PGGrid';
import LoadingSkeleton from '../components/Shared/LoadingSkeleton';

/**
 * Home page for PG Near Me.
 * Integrates Hero banner, categories, and PG listings.
 */
export default function HomePage() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const featuredPgs = pgs.slice(0, 3);
  const recentlyAdded = [...pgs].reverse().slice(0, 3);

  return (
    <div className="space-y-16">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Category Suggestions (Tech Parks, Colleges) */}
      <SearchSuggestions />

      {/* 3. Value Proposition Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-750 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-primary-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">100% Verified Owners</h4>
            <p className="text-xs text-slate-400 mt-1">Direct listings verified by our ground team.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 border-t md:border-t-0 md:border-x border-slate-100 dark:border-slate-700 pt-6 md:pt-0 md:px-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Fully Managed Co-Living</h4>
            <p className="text-xs text-slate-400 mt-1">Zero hassle setups including meals, WiFi & cleaning.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 border-t md:border-t-0 pt-6 md:pt-0 pl-0 md:pl-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Near Transit Hubs</h4>
            <p className="text-xs text-slate-400 mt-1">Walkable distance to metro lines and IT corridors.</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Listings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider block">Editor's Choice</span>
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center mt-1">
              <Sparkles className="w-5 h-5 mr-2 text-primary-500" />
              Featured Stays
            </h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
            View All Stays
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="GRID" count={3} />
        ) : (
          <PGGrid pgs={featuredPgs} />
        )}
      </section>

      {/* 5. Recently Added */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">New Listings</span>
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center mt-1">
              <Clock className="w-5 h-5 mr-2 text-primary-500" />
              Recently Added Stays
            </h2>
          </div>
          <Link href="/search" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
            View All Stays
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="GRID" count={3} />
        ) : (
          <PGGrid pgs={recentlyAdded} />
        )}
      </section>
    </div>
  );
}
