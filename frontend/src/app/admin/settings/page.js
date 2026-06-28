"use client";

import React, { useState } from 'react';
import { Save, Bell, ShieldAlert, Check } from 'lucide-react';
import AdminHeader from '../../../components/Admin/AdminHeader';

/**
 * AdminSettingsPage component.
 * Allows host users to adjust profile contacts and toggle alert configs.
 */
export default function AdminSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Settings & Credentials" 
        subtitle="Manage owner profile details and system integrations." 
      />

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-emerald-600 dark:text-emerald-450 font-bold">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>Configurations saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <Bell className="w-4 h-4 mr-2 text-primary-500" />
            Lead Notifications
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded bg-slate-50 border-slate-200"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Email Alerts on New Inquiries</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded bg-slate-50 border-slate-200"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Instant SMS Updates (WhatsApp integration)</span>
            </label>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Section 2: Security */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-primary-500" />
            Security & MFA
          </h3>
          <p className="text-[11px] text-slate-400">Two-factor login is currently managed through your Google Workspace login integration.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
