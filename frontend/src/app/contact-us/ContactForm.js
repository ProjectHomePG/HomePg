"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert, User, Mail, Phone, MessageSquare } from 'lucide-react';
import inquiryService from '../../services/inquiryService';

/**
 * ContactForm component.
 * Sends a general contact message to the backend inbox (no PG association).
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await inquiryService.submitContact({ name, email, phone, message });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 sm:p-12">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h2 className="text-base font-black text-emerald-800 dark:text-emerald-400">
            Message sent!
          </h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed">
            Thanks for reaching out, {name.split(' ')[0]}. Our team will reply to{' '}
            <span className="font-semibold">{email}</span> within one business day.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setName('');
              setEmail('');
              setPhone('');
              setMessage('');
            }}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 underline underline-offset-2 cursor-pointer"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-white">Send us a message</h2>
        <p className="text-xs text-slate-400 mt-1">All fields marked with * are required.</p>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Name *
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-4 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-4 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-4 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Message *
          </label>
          <div className="relative">
            <MessageSquare className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              rows={6}
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-4 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors resize-none"
              required
            />
          </div>
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
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
