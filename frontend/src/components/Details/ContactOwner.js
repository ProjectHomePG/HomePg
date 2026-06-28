"use client";

import React, { useState } from 'react';
import { User, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import pgService from '../../services/pgService';

/**
 * ContactOwner component.
 * Displays owner credentials and houses the booking inquiry form.
 */
export default function ContactOwner({ pgId, owner = {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('Hi, I am interested in this PG and would like to schedule a visit.');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await pgService.submitInquiry({
        pgId,
        name,
        email,
        phone,
        message
      });
      setSuccess(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Host profile summary */}
      <div className="flex items-center space-x-4 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-primary-600 flex items-center justify-center text-white text-lg font-extrabold shadow-sm">
          {owner.name ? owner.name.charAt(0) : 'O'}
        </div>
        <div>
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Property Owner</span>
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{owner.name || "PG Landlord"}</h3>
        </div>
      </div>

      {success ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <div>
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Inquiry Submitted!</h4>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-500 mt-1">The owner has been notified and will contact you shortly.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Book a Visit / Ask questions</h4>
          
          {/* Name */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Mobile Number"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none"
              required
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Custom message..."
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center justify-center shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-2" />
                Contact Owner
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
