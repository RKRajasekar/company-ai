import React from 'react';
import { DocumentStatus } from '@/lib/types';
import { CheckCircle2, Clock, XCircle, FileUp, Cpu } from 'lucide-react';

interface StatusBadgeProps {
  status: DocumentStatus | 'active' | 'inactive' | 'pending' | 'disabled' | 'blocked' | 'archived' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;
  let label = status;

  if (['active', 'approved', 'indexed', 'success'].includes(normalized)) {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  } else if (['pending', 'processing', 'embedding', 'uploading', 'warning'].includes(normalized)) {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = normalized === 'uploading' ? FileUp : (normalized === 'embedding' || normalized === 'processing' ? Cpu : Clock);
  } else if (['disabled', 'rejected', 'blocked', 'error', 'archived', 'inactive'].includes(normalized)) {
    bgClass = 'bg-red-50 text-red-700 border-red-200';
    Icon = XCircle;
  }

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5 space-x-1' : 'text-xs px-2.5 py-1 space-x-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-md border ${bgClass} ${sizeClass}`}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{label}</span>
    </span>
  );
}
