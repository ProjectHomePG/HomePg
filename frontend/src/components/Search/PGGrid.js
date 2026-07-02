import React from 'react';
import PGCard from './PGCard';
import EmptyState from '../Shared/EmptyState';

/**
 * PGGrid component.
 * Maps arrays of PG data into grid items, adapting columns based on responsive break-points.
 */
export default function PGGrid({ pgs = [] }) {
  if (pgs.length === 0) {
    return <EmptyState message="No PG accommodations match your search criteria. Try removing some filters." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
      {pgs.map((pg) => (
        <PGCard key={pg.id} pg={pg} />
      ))}
    </div>
  );
}
