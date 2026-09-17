"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

/**
 * LoginPage component.
 * Allows users, owners, and admins to sign in.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 py-8">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent block">
              Livio
            </span>
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">Welcome Back</h2>
            <p className="text-xs text-slate-400">Sign in to search properties and manage listings.</p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-4 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-10 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
            New to Livio?{' '}
            <Link href="/register" className="text-primary-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-slate-400">
              Demo: john@example.com / owner@example.com / admin@example.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
