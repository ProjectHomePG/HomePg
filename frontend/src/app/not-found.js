import Link from 'next/link';
import { Compass, Search, Home, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 sm:p-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-primary-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Page not found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you are looking for does not exist, may have been moved, or the link is out of
            date. Try searching for what you need instead.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse PGs
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
          <Link href="/about-us" className="hover:text-primary-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact-us" className="hover:text-primary-600 transition-colors">
            Contact Us
          </Link>
          <Link href="/privacy-policy" className="hover:text-primary-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-primary-600 transition-colors">
            Terms &amp; Conditions
          </Link>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline pt-1"
        >
          Start a new search
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
