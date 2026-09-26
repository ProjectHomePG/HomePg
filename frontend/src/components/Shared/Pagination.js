import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Pagination component.
 * Allows moving page lists backwards and forwards.
 */
export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 w-full">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap flex-shrink-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </button>

      {/* Page Indicators */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap flex-shrink-0"
      >
        Next
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}
