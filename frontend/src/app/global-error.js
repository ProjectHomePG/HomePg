"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <head>
        <title>Server Error | Livio</title>
      </head>
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-primary-600 flex items-center justify-center mx-auto text-3xl font-black">
            !
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">
              Error 500
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">Something went wrong</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              The application hit an unexpected error. Please try again in a moment.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
