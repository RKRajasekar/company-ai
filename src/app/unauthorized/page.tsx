'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const { currentRole } = useAuth();

  const userDashboard = 
    currentRole === 'super_admin' ? '/dashboard' :
    currentRole === 'hr_admin' ? '/hr/dashboard' :
    currentRole === 'manager' ? '/manager/dashboard' :
    currentRole === 'team_lead' ? '/team-lead/dashboard' : '/employee/dashboard';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-slate-900">
            Access Denied
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            You don't have permission to access this page with your current account role.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <Link
            href={userDashboard}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
