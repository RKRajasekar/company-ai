import React from 'react';
import { UserRole } from '@/lib/types';
import { ShieldCheck, UserCheck, Briefcase, Users, User as UserIcon } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RoleBadge({ role, showIcon = true, size = 'md' }: RoleBadgeProps) {
  const config = {
    super_admin: {
      label: 'Super Admin',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: ShieldCheck
    },
    hr_admin: {
      label: 'HR Admin',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: UserCheck
    },
    manager: {
      label: 'Manager',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Briefcase
    },
    team_lead: {
      label: 'Team Lead',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Users
    },
    employee: {
      label: 'Employee',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: UserIcon
    },
    ai_only_user: {
      label: 'AI User',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: UserIcon
    }
  };

  const item = config[role] || config.employee;
  const IconComponent = item.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 space-x-1 font-medium',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-semibold',
    lg: 'text-xs px-3 py-1.5 space-x-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${item.bg} ${sizeClasses[size]}`}>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{item.label}</span>
    </span>
  );
}
