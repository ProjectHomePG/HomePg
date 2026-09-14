"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Building, 
  Shield, 
  ShieldAlert, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import authService from '../../services/authService';

const ROLES = [
  { id: 'ROLE_USER', label: 'Resident / Tenant', icon: User, demoEmail: 'john@example.com', defaultPass: 'password' },
  { id: 'ROLE_OWNER', label: 'Property Owner', icon: Building, demoEmail: 'owner@example.com', defaultPass: 'password' },
  { id: 'ROLE_ADMIN', label: 'System Admin', icon: Shield, demoEmail: 'admin@example.com', defaultPass: 'password' },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('ROLE_USER');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj.id);
    setEmail(roleObj.demoEmail);
    setPassword(roleObj.defaultPass);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email.trim(), password);
      setSuccess(true);
      setTimeout(() => {
        if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_OWNER') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        // Refresh navbar state
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 150);
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-850/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 transition-all">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span>Verified Co-Living Platform</span>
            </div>
            <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent">Livio</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to browse stays, track inquiries, and manage properties.
            </p>
          </div>

          {/* Role Tab Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Account Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] text-center leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-rose-600 dark:text-rose-400 font-semibold animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>Authenticated successfully! Redirecting...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-primary-600 font-bold hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 text-xs font-semibold pl-10 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In to Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-primary-600 font-bold hover:underline">
              Create free account
            </Link>
          </div>
        </div>

        {/* Sandbox Quick Access Panel */}
        <div className="bg-white/60 dark:bg-slate-850/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span>Instant Sandbox Demo Credentials</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Click any account to pre-load working login credentials instantly:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className="px-2 py-2 text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-center"
              >
                {role.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
