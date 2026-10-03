"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, Search } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 sm:p-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-primary-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Error 500
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            We hit an unexpected error while loading this page. It is not your fault — try again,
            and if it keeps happening let us know.
          </p>
        </div>

        {error?.message && (
          <p className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl p-3 break-words">
            {error.message}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
          <Link href="/search" className="hover:text-primary-600 transition-colors">
            <Search className="w-3.5 h-3.5 inline mr-1" />
            Browse PGs
          </Link>
          <Link href="/contact-us" className="hover:text-primary-600 transition-colors">
            Report a problem
          </Link>
        </div>
      </div>
    </div>
  );
}
