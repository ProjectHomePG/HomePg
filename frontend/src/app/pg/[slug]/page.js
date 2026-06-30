"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, Calendar, DollarSign, ShieldAlert, Award, MapPin } from 'lucide-react';
import pgService from '../../../services/pgService';
import ImageGallery from '../../../components/Details/ImageGallery';
import Amenities from '../../../components/Details/Amenities';
import ReviewList from '../../../components/Details/ReviewList';
import NearbyPlaces from '../../../components/Details/NearbyPlaces';
import ContactOwner from '../../../components/Details/ContactOwner';
import MapView from '../../../components/Search/MapView';
import LoadingSkeleton from '../../../components/Shared/LoadingSkeleton';

/**
 * PG Details Page.
 * Displays extensive details of a single property listing.
 */
export default function PGDetailsPage({ params }) {
  // Unwrap dynamic params promise
  const resolvedParams = use(params);
  const router = useRouter();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        const data = await pgService.getBySlug(resolvedParams.slug);
        setPg(data);
      } catch (err) {
        setError(err.message || "Failed to load stay details");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <LoadingSkeleton type="TEXT" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Listing Not Found</h2>
        <p className="text-xs text-slate-400">{error || "The requested PG accommodation does not exist."}</p>
        <Link href="/search" className="inline-block px-5 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs / Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Search Results
        </button>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={pg.images} />

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Main Information) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/30 text-primary-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                {pg.genderType} accommodation
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {pg.sharingType} sharing
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-100">
              {pg.title}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-primary-500 flex-shrink-0" />
              {pg.address}, {pg.city}, {pg.state}
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs">
              About this accommodation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
              {pg.description}
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Amenities checklist */}
          <Amenities amenities={pg.amenities} />

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Map Location placeholder */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs">
              Property Location
            </h2>
            <p className="text-xs text-slate-400">Convenient transport links and local food markets located directly outside the building.</p>
            <MapView pgs={[pg]} height="h-[300px]" />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Nearby places */}
          <NearbyPlaces places={pg.nearbyPlaces} />

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Review list */}
          <ReviewList pgId={pg.id} />

        </div>

        {/* Right Column (Inquiry / Sticky Form Widget) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          
          {/* Quick Pricing Summary */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Monthly Rent</span>
              <div>
                <span className="text-2xl font-black">₹{pg.price.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-450 block -mt-1 text-right">no extra maintenance</span>
              </div>
            </div>
            <div className="border-t border-slate-850 pt-3 flex items-center space-x-2 text-[10px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span>Includes daily cleaning & power backup fuel.</span>
            </div>
          </div>

          {/* Owner Inquiry Form */}
          <ContactOwner pgId={pg.id} owner={pg.owner} />

          {/* Rules Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-primary-500" />
              PG Stay Guidelines
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {pg.rules}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
