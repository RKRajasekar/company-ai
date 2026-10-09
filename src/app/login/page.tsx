'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notFoundError, setNotFoundError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNotFoundError(false);
    setIsLoading(true);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter a valid email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Invalid email or password.');
        if (data.notFound || res.status === 404) {
          setNotFoundError(true);
        }
        setIsLoading(false);
        return;
      }

      // Sync AuthContext client state with full authenticated user details
      login(data.user?.email || email, data.user?.role || 'employee', data.user);
      setIsLoading(false);

      // Perform role-based redirection as returned from backend authentication
      const targetUrl = data.redirectTo || '/dashboard';
      window.location.href = targetUrl;
    } catch (err) {
      setErrorMsg('Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Enter your email and password to log in
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center space-y-2 whitespace-pre-line leading-relaxed">
            <div>{errorMsg}</div>
            {notFoundError && (
              <div className="pt-1">
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                >
                  <span>Go to Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Development / Demo Accounts Section */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Demo Accounts
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Dev / Testing
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Select a role below to populate credentials, then click <strong>Sign In</strong>.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { role: 'Admin', email: 'ajairaja2004@gmail.com', pass: 'R@jasekar2004' },
              { role: 'HR', email: 'hr@gmail.com', pass: 'R@jasekar2004' },
              { role: 'Team Lead', email: 'teamlead@gmail.com', pass: 'R@jasekar2004' },
              { role: 'Manager', email: 'manager@gmail.com', pass: 'R@jasekar2004' },
              { role: 'Employee', email: 'employee@gmail.com', pass: 'R@jasekar2004' }
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.pass);
                  setErrorMsg('');
                  setNotFoundError(false);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col justify-center cursor-pointer ${
                  demo.role === 'Admin'
                    ? 'col-span-2 bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span className="text-[11px] font-bold tracking-tight">{demo.role} Demo</span>
                <span className={`text-[10px] truncate ${demo.role === 'Admin' ? 'text-slate-300' : 'text-slate-500'}`}>
                  {demo.email}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
