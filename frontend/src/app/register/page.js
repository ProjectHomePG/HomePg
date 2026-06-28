"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, User, Mail, Lock, Phone, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import authService from '../../services/authService';

/**
 * RegisterPage component.
 * Allows new users to create accounts as tenants or PG owners.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_USER'); // ROLE_USER or ROLE_OWNER
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password, phone, role);
      if (role === 'ROLE_OWNER') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent block">
            PG Near Me
          </span>
          <h2 className="text-lg font-black text-slate-805 dark:text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400">Join us to find or list premium accommodations.</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setRole('ROLE_USER')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'ROLE_USER'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-450 hover:text-slate-700'
            }`}
          >
            I am a Tenant
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_OWNER')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'ROLE_OWNER'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-450 hover:text-slate-700'
            }`}
          >
            I am a PG Owner
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 88888"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer transition-colors"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-450 border-t border-slate-100 dark:border-slate-700 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
