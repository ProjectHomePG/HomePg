import React from 'react';
import * as Icons from 'lucide-react';

// Dynamic icon resolver helper
function AmenityIcon({ name, className }) {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} />;
}

/**
 * Amenities component.
 * Lists amenities like WiFi, Air Conditioning, meals, security with matching icons.
 */
export default function Amenities({ amenities = [] }) {
  if (amenities.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs">
        What this place offers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-slate-900 flex items-center justify-center text-primary-600">
              <AmenityIcon name={item.icon} className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
