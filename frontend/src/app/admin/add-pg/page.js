"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import pgService from '../../../services/pgService';
import AdminHeader from '../../../components/Admin/AdminHeader';
import PGForm from '../../../components/Admin/PGForm';

/**
 * AdminAddPG page.
 * Renders the forms to add new PG stays.
 */
export default function AdminAddPGPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await pgService.create(formData);
      router.push('/admin');
    } catch (err) {
      setError(err.message || "Failed to create stay listing.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader 
        title="Add PG Stay" 
        subtitle="Create a new Paying Guest stay listing on the portal." 
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form component */}
      <PGForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
