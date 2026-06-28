import React from 'react';
import * as Icons from 'lucide-react';

function StatIcon({ name, className }) {
  const IconComponent = Icons[name] || Icons.TrendingUp;
  return <IconComponent className={className} />;
}

/**
 * DashboardCard component.
 * Displays administrative stats (total listings, reviews count, leads count).
 */
export default function DashboardCard({ title, value, icon = "TrendingUp", trend, color = "text-primary-600 bg-primary-50" }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">{title}</span>
        <h3 className="text-2xl font-black text-slate-850 dark:text-slate-100">{value}</h3>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <StatIcon name={icon} className="w-6 h-6" />
      </div>
    </div>
  );
}
