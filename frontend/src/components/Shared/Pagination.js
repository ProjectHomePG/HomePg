import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Pagination component.
 * Allows moving page lists backwards and forwards.
 */
export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </button>

      {/* Page Indicators */}
      <div className="hidden sm:flex items-center space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <span className="sm:hidden text-xs font-semibold text-slate-500">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
}
