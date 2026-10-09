'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500">
            Enter your work email address to receive a password reset link
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs">
            <div className="font-semibold text-emerald-800">Reset Link Sent</div>
            <p className="text-emerald-700">
              Instructions sent to <span className="font-mono">{email}</span>.
            </p>
            <Link
              href="/reset-password"
              className="inline-block pt-1 text-xs text-blue-600 font-medium hover:underline"
            >
              Proceed to Reset Password →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Work Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 text-center text-xs">
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

