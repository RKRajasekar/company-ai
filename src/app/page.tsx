'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, currentRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const target = 
        currentRole === 'super_admin' ? '/dashboard' :
        currentRole === 'hr_admin' ? '/hr/dashboard' :
        currentRole === 'manager' ? '/manager/dashboard' :
        currentRole === 'team_lead' ? '/team-lead/dashboard' : '/employee/dashboard';
      router.replace(target);
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, currentRole, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading Workspace...</span>
      </div>
    </div>
  );
}

