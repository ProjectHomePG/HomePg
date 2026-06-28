import React from 'react';
import { Briefcase, GraduationCap, Train, Hospital, MapPin } from 'lucide-react';

// Maps place types to Lucide Icons
function PlaceIcon({ type, className }) {
  switch (type) {
    case 'OFFICE':
      return <Briefcase className={className} />;
    case 'COLLEGE':
      return <GraduationCap className={className} />;
    case 'METRO':
      return <Train className={className} />;
    case 'HOSPITAL':
      return <Hospital className={className} />;
    default:
      return <MapPin className={className} />;
  }
}

/**
 * NearbyPlaces component.
 * Lists transit points, tech parks, hospitals, and colleges.
 */
export default function NearbyPlaces({ places = [] }) {
  if (places.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs">
        Nearby Hubs & Landmarks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {places.map((place, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <PlaceIcon type={place.type} className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {place.name}
              </span>
            </div>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-2.5 py-1 rounded-full">
              {place.distance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
