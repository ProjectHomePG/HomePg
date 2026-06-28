"use client";

import React, { useState } from 'react';
import { Mail, Phone, Calendar, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminHeader from '../../../components/Admin/AdminHeader';

const MOCK_INQUIRIES = [
  { id: 1, name: 'Siddharth Sen', email: 'siddharth@example.com', phone: '+91 98765 12345', message: 'I want to schedule a visit for double sharing room this Sunday afternoon.', pgTitle: 'Stanza Living Dublin House', status: 'PENDING', date: '2026-06-25T11:00:00Z' },
  { id: 2, name: 'Pooja Hegde', email: 'pooja.h@example.com', phone: '+91 99000 88776', message: 'Is there single sharing room available from July 1st? Please send rent agreements details.', pgTitle: 'Zolo Stay Nest Girls PG', status: 'CONTACTED', date: '2026-06-26T09:30:00Z' },
  { id: 3, name: 'Rahul Varma', email: 'rahul.v@example.com', phone: '+91 91234 11223', message: 'Would like to know the pet policy and vehicle parking space configurations.', pgTitle: 'CoHo Premium Unisex Living', status: 'RESOLVED', date: '2026-06-27T14:15:00Z' }
];

/**
 * AdminInquiries page.
 * Manages customer inquiries / leads for listed PGs.
 */
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);

  const toggleStatus = (id, newStatus) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450';
      case 'CONTACTED':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-450';
      default:
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader 
        title="Customer Inquiries" 
        subtitle="Manage booking leads and customer scheduling requests." 
      />

      {/* Inquiry list container */}
      <div className="space-y-4">
        {inquiries.map((inq) => {
          const formattedDate = new Date(inq.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div 
              key={inq.id} 
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              {/* Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">{formattedDate}</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {inq.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded mt-1 inline-block">
                    Inquiry on: {inq.pgTitle}
                  </span>
                </div>

                {/* Status selector */}
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${getStatusBadge(inq.status)}`}>
                    {inq.status}
                  </span>
                  
                  <select
                    value={inq.status}
                    onChange={(e) => toggleStatus(inq.id, e.target.value)}
                    className="text-[10px] font-bold border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-900 outline-none cursor-pointer"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 text-xs font-semibold text-slate-700 dark:text-slate-300 italic border border-slate-100 dark:border-slate-850">
                "{inq.message}"
              </div>

              {/* Contact Channels */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-850">
                <a href={`mailto:${inq.email}`} className="flex items-center text-slate-500 hover:text-primary-600 transition-colors">
                  <Mail className="w-4 h-4 mr-1.5 text-primary-500" />
                  {inq.email}
                </a>
                <a href={`tel:${inq.phone}`} className="flex items-center text-slate-500 hover:text-primary-600 transition-colors">
                  <Phone className="w-4 h-4 mr-1.5 text-primary-500" />
                  {inq.phone}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
