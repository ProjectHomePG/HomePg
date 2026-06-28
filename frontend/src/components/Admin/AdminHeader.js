"use client";

import React, { useEffect, useState } from 'react';
import authService from '../../services/authService';

/**
 * AdminHeader component.
 * Displays page titles, quick settings or notifications, and active host profile tags.
 */
export default function AdminHeader({ title = "Overview", subtitle = "Manage listing data and coordinate requests." }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100">{title}</h1>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      {user && (
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/20 text-primary-600 flex items-center justify-center font-extrabold text-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block -mb-0.5">Admin Profile</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>
        </div>
      )}
    </header>
  );
}
