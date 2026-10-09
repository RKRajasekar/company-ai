import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  label?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function DashboardCard({
  title,
  value,
  label,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-blue-600'
}: DashboardCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconTextColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <div className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
            changeType === 'positive'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : changeType === 'negative'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" />}
            {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1 text-red-600" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {label && (
        <p className="mt-1 text-xs text-slate-500">
          {label}
        </p>
      )}
    </div>
  );
}
