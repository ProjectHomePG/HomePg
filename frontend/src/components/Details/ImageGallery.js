"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Heart, Share2, Grid } from 'lucide-react';

/**
 * ImageGallery component.
 * Layouts listing photos in an Airbnb-inspired grid with custom styling and gallery overlays.
 */
export default function ImageGallery({ images = [] }) {
  const [liked, setLiked] = useState(false);

  // Fallback styling gradients for testing
  const gradients = [
    'from-rose-500 to-rose-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600'
  ];

  return (
    <div className="space-y-4">
      {/* Top Action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-primary-500" />
          Photo Gallery
        </h1>
        <div className="flex space-x-2">
          <button className="flex items-center text-xs font-bold px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer">
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share
          </button>
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center text-xs font-bold px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer ${liked ? 'text-rose-500 border-rose-200' : 'text-slate-700 dark:text-slate-300'}`}
          >
            <Heart className={`w-3.5 h-3.5 mr-1.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            {liked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-sm relative">
        {/* Featured Large Left Image */}
        <div className={`md:col-span-2 md:row-span-2 relative bg-gradient-to-br ${gradients[0]} flex items-center justify-center`}>
          <span className="text-white text-sm font-extrabold bg-slate-900/60 px-4 py-2 rounded-full uppercase tracking-wider">
            Premium Stay View
          </span>
        </div>

        {/* Smaller Right Images */}
        <div className={`hidden md:flex relative bg-gradient-to-br ${gradients[1]} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">Bedroom</span>
        </div>
        <div className={`hidden md:flex relative bg-gradient-to-br ${gradients[2]} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">Washroom</span>
        </div>
        <div className={`hidden md:flex relative bg-gradient-to-br ${gradients[3]} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">Lounge</span>
        </div>
        <div className={`hidden md:flex relative bg-gradient-to-br ${gradients[4]} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">Dining</span>
        </div>

        {/* View All Photos Button */}
        <button className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-xs py-2 px-4 rounded-xl shadow-md hover:bg-white flex items-center space-x-2 cursor-pointer z-10">
          <Grid className="w-4 h-4" />
          <span>Show all photos</span>
        </button>
      </div>
    </div>
  );
}
