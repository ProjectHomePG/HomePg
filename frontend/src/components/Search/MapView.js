"use client";

import React, { useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * MapView component.
 * Serves as a visually compelling placeholder for Google Maps.
 * Displays markers corresponding to listings and map controls.
 */
export default function MapView({ pgs = [], height = "h-[450px]" }) {
  const [zoom, setZoom] = useState(13);

  return (
    <div className={`relative w-full ${height} bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center`}>
      
      {/* Visual Map Background Pattern using SVG */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Mock Map Streets & River Overlay */}
      <svg className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-850 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 100 Q 150 120 300 100 T 600 120 T 900 100 T 1200 120" fill="none" stroke="#93c5fd" strokeWidth="12" opacity="0.4" />
        <path d="M 100 0 L 100 600 M 400 0 L 400 600 M 800 0 L 800 600" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M 0 200 L 1200 200 M 0 450 L 1200 450" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Dynamic Markers for listings */}
      <div className="absolute inset-0 p-8 flex items-center justify-center">
        {pgs.map((pg, index) => {
          // Calculate arbitrary scatter offsets for the mock markers
          const topPercent = 30 + (index * 15) % 50;
          const leftPercent = 20 + (index * 20) % 65;

          return (
            <div 
              key={pg.id}
              className="absolute group cursor-pointer flex flex-col items-center"
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-md pointer-events-none">
                {pg.title} <span className="text-primary-400">₹{pg.price.toLocaleString()}</span>
              </div>

              {/* Pin representation */}
              <div className="w-8 h-8 rounded-full bg-primary-600 border-2 border-white dark:border-slate-800 text-white flex items-center justify-center shadow-md transform hover:scale-125 transition-transform">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
              
              {/* Label */}
              <span className="mt-1 text-[9px] font-extrabold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded shadow-sm border border-slate-100 dark:border-slate-700">
                ₹{(pg.price / 1000).toFixed(1)}k
              </span>
            </div>
          );
        })}
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute right-4 bottom-4 flex flex-col space-y-2">
        <button 
          onClick={() => setZoom(z => Math.min(18, z + 1))}
          className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(10, z - 1))}
          className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute left-4 bottom-4 flex items-center bg-white/95 dark:bg-slate-800/95 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-[10px] font-bold text-slate-500 dark:text-slate-400 space-x-1.5">
        <Navigation className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
        <span>Google Maps Placeholder • Zoom: {zoom}</span>
      </div>
    </div>
  );
}
