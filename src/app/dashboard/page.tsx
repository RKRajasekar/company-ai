'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { HRAdminDashboard } from '@/components/dashboard/HRAdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { TeamLeadDashboard } from '@/components/dashboard/TeamLeadDashboard';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';

export default function DashboardPage() {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'hr_admin':
      return <HRAdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'team_lead':
      return <TeamLeadDashboard />;
    case 'employee':
    default:
      return <EmployeeDashboard />;
  }
}
