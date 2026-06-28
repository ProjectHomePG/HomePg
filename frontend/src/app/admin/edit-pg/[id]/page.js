"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import pgService from '../../../../services/pgService';
import AdminHeader from '../../../../components/Admin/AdminHeader';
import PGForm from '../../../../components/Admin/PGForm';

/**
 * AdminEditPG page.
 * Loads and edits details of an existing PG stay based on route ID parameters.
 */
export default function AdminEditPGPage({ params }) {
  // Unwrap dynamic params promise
  const resolvedParams = use(params);
  const router = useRouter();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { id } = resolvedParams;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await pgService.getById(id);
        setPg(data);
      } catch (err) {
        setError(err.message || "Failed to fetch PG stay details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await pgService.update(id, formData);
      router.push('/admin');
    } catch (err) {
      setError(err.message || "Failed to update PG stay listing.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse">Loading listing configurations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader 
        title="Edit PG Stay" 
        subtitle={`Update details and configuration for: ${pg ? pg.title : 'Stay'}`} 
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {pg && (
        <PGForm 
          initialData={pg} 
          onSubmit={handleSubmit} 
          submitting={submitting} 
        />
      )}
    </div>
  );
}
