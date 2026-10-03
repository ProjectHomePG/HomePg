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
 * Home page for Livio.
 * Integrates premium Hero banner, categories, and PG listings.
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

  const featuredPgs = pgs.slice(0, 6);
  const recentlyAdded = [...pgs].reverse().slice(0, 6);

  return (
    <div className="space-y-20 lg:space-y-32">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Category Suggestions (Tech Parks, Colleges) */}
      <section className="relative">
        <SearchSuggestions />
      </section>

      {/* 3. Value Proposition Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 border border-slate-100 dark:border-slate-800 shadow-soft">
        <div className="flex flex-col items-start space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
            <ShieldCheck className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">100% Verified Owners</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Direct listings verified personally by our on-ground team. No brokers, no hidden fees.</p>
          </div>
        </div>
        
        <div className="flex flex-col items-start space-y-4 md:px-8 border-t md:border-t-0 md:border-x border-slate-100 dark:border-slate-800 pt-8 md:pt-0">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <Building2 className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Premium Co-Living</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">Zero hassle setups including 3-time meals, high-speed WiFi, and professional daily cleaning.</p>
          </div>
        </div>

        <div className="flex flex-col items-start space-y-4 pt-8 md:pt-0 md:pl-8 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
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

      {/* 5. Recently Added */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">New Listings</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center">
              Recently Added
              <Clock className="w-6 h-6 ml-3 text-slate-400" />
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
          <PGGrid pgs={recentlyAdded} />
        )}
      </section>
    </div>
  );
}
