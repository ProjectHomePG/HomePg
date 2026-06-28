import React from 'react';
import Link from 'next/link';
import { Briefcase, GraduationCap, Train, Hospital, Building } from 'lucide-react';

const CATEGORIES = [
  { name: 'Tech Parks', icon: Briefcase, query: 'Tech Park', color: 'from-orange-500 to-amber-500' },
  { name: 'Colleges', icon: GraduationCap, query: 'University', color: 'from-blue-500 to-indigo-500' },
  { name: 'Metro Stations', icon: Train, query: 'Metro', color: 'from-emerald-500 to-teal-500' },
  { name: 'Hospitals', icon: Hospital, query: 'Hospital', color: 'from-rose-500 to-pink-500' }
];

/**
 * SearchSuggestions component.
 * Displays categorization boxes to quickly fire searches for near colleges/offices.
 */
export default function SearchSuggestions() {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Search by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={idx} 
              href={`/search?query=${encodeURIComponent(cat.query)}`}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-100 dark:hover:border-slate-700 transition-all hover:scale-[1.02] text-center cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
              <span className="text-xs text-slate-400 mt-1">Browse nearby</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
