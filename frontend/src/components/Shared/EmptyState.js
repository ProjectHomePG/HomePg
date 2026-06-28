import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

/**
 * EmptyState component.
 * Displays a clean warning overlay when list arrays return length zero.
 */
export default function EmptyState({ message = "No records found.", onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 max-w-md mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/20 text-primary-500 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>
      
      <div>
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">No Listings Match</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {message}
        </p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
