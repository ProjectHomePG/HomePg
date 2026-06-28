import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Users, Heart } from 'lucide-react';

/**
 * PGCard component.
 * Renders individual list items with image previews, details, ratings, and price tags.
 */
export default function PGCard({ pg }) {
  // Determine gender badge styles
  const getGenderBadge = (gender) => {
    switch (gender) {
      case 'MALE':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';
      case 'FEMALE':
        return 'bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400';
      default:
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400';
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg shadow-card-hover relative">
      
      {/* Save Button */}
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 backdrop-blur text-slate-500 hover:text-rose-500 transition-colors shadow-sm cursor-pointer">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image / Thumbnail Container */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-rose-50 to-primary-100 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {/* We use gradient placeholder styles inside the card */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">
          <span className="text-xs tracking-wider uppercase bg-white/90 dark:bg-slate-900/90 py-1.5 px-3 rounded-full shadow-sm">
            {pg.sharingType} sharing
          </span>
        </div>
        
        {/* Absolute Gender Tag */}
        <span className={`absolute bottom-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getGenderBadge(pg.genderType)}`}>
          {pg.genderType}
        </span>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating and Address */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-primary-500" />
              {pg.city}
            </span>
            <span className="flex items-center text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 mr-1" />
              {pg.rating.toFixed(1)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-1">
            <Link href={`/pg/${pg.slug}`}>
              {pg.title}
            </Link>
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {pg.description}
          </p>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              ₹{pg.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1">/ month onwards</span>
          </div>

          <Link
            href={`/pg/${pg.slug}`}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
