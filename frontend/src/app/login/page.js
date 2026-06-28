"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, User, ShieldAlert } from 'lucide-react';
import authService from '../../services/authService';

/**
 * LoginPage component.
 * Allows users, owners, and admins to sign in to their mock sessions.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_OWNER') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      // Trigger a page refresh to update Navbar auth state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper helper to set mock login inputs instantly
  const handleQuickLogin = (mockEmail) => {
    setEmail(mockEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6">
      {/* Login Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent block">
            PG Near Me
          </span>
          <h2 className="text-lg font-black text-slate-805 dark:text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to search properties and manage listings.</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-450 border-t border-slate-100 dark:border-slate-700 pt-4">
          New to PG Near Me?{' '}
          <Link href="/register" className="text-primary-600 font-bold hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Quick Access Mock Login shortcuts for testing */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-3">
        <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-primary-500" />
          Sandbox Role Testing Shortcuts
        </h4>
        <p className="text-[10px] text-slate-400">Click any user role below to load pre-filled credentials:</p>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleQuickLogin('john@example.com')}
            className="p-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 dark:text-slate-200 text-center"
          >
            Customer User
          </button>
          <button 
            onClick={() => handleQuickLogin('owner@example.com')}
            className="p-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 dark:text-slate-200 text-center"
          >
            Property Owner
          </button>
          <button 
            onClick={() => handleQuickLogin('admin@example.com')}
            className="p-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 dark:text-slate-200 text-center"
          >
            System Admin
          </button>
        </div>
      </div>
    </div>
  );
}
