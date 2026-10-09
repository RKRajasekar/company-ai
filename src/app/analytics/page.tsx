'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AnalyticsPage() {
  const router = useRouter();
  const { currentRole } = useAuth();

  useEffect(() => {
    const target = 
      currentRole === 'super_admin' ? '/dashboard' :
      currentRole === 'hr_admin' ? '/hr/dashboard' :
      currentRole === 'manager' ? '/manager/dashboard' :
      currentRole === 'team_lead' ? '/team-lead/dashboard' : '/employee/dashboard';
    router.replace(target);
  }, [currentRole, router]);

  return (
    <div className="p-8 text-center text-sm font-semibold text-slate-500">
      Redirecting to Dashboard...
    </div>
  );
}

