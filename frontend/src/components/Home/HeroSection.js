import React from 'react';
import SearchBar from './SearchBar';

/**
 * HeroSection component.
 * Displays a premium tagline and embeds the SearchBar to capture primary queries.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 rounded-3xl bg-slate-900 text-white shadow-soft">
      {/* Background Gradients and Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,63,94,0.18),rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600 rounded-full blur-[140px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500 rounded-full blur-[140px] opacity-10"></div>

      <div className="relative max-w-[1200px] mx-auto text-center px-4 sm:px-6 lg:px-10" style={{ justifySelf: 'center' }}>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 lg:mb-8">
          Find Your Perfect{" "}
          <span className="bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">
            Paying Guest
          </span>{" "}
          Stay
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed" style={{ justifySelf: 'center' }}>
          Search from thousands of fully-managed co-living spaces, hostels, and rooms near your college, office, metro station, or hospital.
        </p>

        {/* Embedded Search Component */}
        <div className="w-full">
          <SearchBar />
        </div>

        {/* Quick Suggestion Categories */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Popular Searches:</span>
          <a href="/search?query=Manyata+Tech+Park" className="px-3 py-1 rounded-full border border-slate-700 hover:border-primary-500 hover:text-white transition-colors">Manyata Tech Park</a>
          <a href="/search?query=HSR+Layout" className="px-3 py-1 rounded-full border border-slate-700 hover:border-primary-500 hover:text-white transition-colors">HSR Layout</a>
          <a href="/search?query=DU+North+Campus" className="px-3 py-1 rounded-full border border-slate-700 hover:border-primary-500 hover:text-white transition-colors">DU Campus</a>
        </div>
      </div>
    </section>
  );
}
