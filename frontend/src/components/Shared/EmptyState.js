import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

/**
 * Premium EmptyState component.
 * Displays a clean, elegant warning overlay when list arrays return length zero.
 */
export default function EmptyState({ message = "No records found.", onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-soft max-w-md mx-auto my-8 relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-primary-500 rounded-full blur-[80px] opacity-10"></div>
      
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 shadow-inner relative z-10">
        <SearchX className="w-10 h-10" strokeWidth={1.5} />
      </div>
      
      <div className="relative z-10">
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2">No Listings Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-8 relative z-10 inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg hover:shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
