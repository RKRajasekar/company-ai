'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { PermissionKey } from '@/lib/types';

interface PermissionGuardProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { hasPermission, currentRole } = useAuth();

  // Super Admin always has full access
  if (currentRole === 'super_admin' || hasPermission(permission)) {
    return <>{children}</>;
  }

  return (
    <div className="p-8 max-w-md mx-auto my-16 bg-white border border-red-200 rounded-2xl shadow-xs text-center space-y-4 font-sans">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access Denied</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          You don't have permission to access this page. Please contact your system administrator to assign permissions.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
