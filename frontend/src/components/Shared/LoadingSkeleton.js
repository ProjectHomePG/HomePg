import React from 'react';

/**
 * LoadingSkeleton component.
 * Renders pulse animations representing loading cards and titles.
 */
export default function LoadingSkeleton({ type = "GRID", count = 3 }) {
  if (type === "GRID") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback text rows loading
  return (
    <div className="space-y-4 w-full animate-pulse">
      <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  );
}
