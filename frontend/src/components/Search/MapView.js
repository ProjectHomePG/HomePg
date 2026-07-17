"use client";

import React from 'react';

/**
 * MapView component.
 * Renders a real, interactive Google Map using the free Google Maps URL Embed API.
 * Dynamically focuses on the listing address or city depending on input listings.
 */
export default function MapView({ pgs = [], height = "h-[450px]" }) {
  // Construct map query string
  const getMapQuery = () => {
    if (pgs && pgs.length === 1) {
      const pg = pgs[0];
      return `${pg.address || ""}, ${pg.city || ""}, ${pg.state || ""}`;
    } else if (pgs && pgs.length > 0) {
      return pgs[0].city || "Bangalore";
    }
    return "Bangalore";
  };

  const query = getMapQuery();
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`relative w-full ${height} bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm`}>
      <iframe
        title="Google Map Location"
        width="100%"
        height="100%"
        className="w-full h-full border-0"
        src={embedUrl}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
