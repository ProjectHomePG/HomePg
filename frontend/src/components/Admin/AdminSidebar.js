"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, MessageSquare, Star, Settings, ChevronLeft, Shield } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Add PG Stay', path: '/admin/add-pg', icon: PlusCircle },
  { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Settings', path: '/admin/settings', icon: Settings }
];

/**
 * AdminSidebar component.
 * Layout side panel containing navigation routes for manage listing options.
 */
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 space-y-8 shadow-sm h-fit">
      
      {/* Title */}
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 dark:border-slate-700">
        <Shield className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Control Panel</span>
      </div>

      {/* Menu links */}
      <nav className="flex flex-col space-y-1.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return home link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Admin Mode</span>
        </Link>
      </div>
    </aside>
  );
}
