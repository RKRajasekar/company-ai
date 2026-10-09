'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  UserPlus, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time updates on employee access requests, vector embedding completions, and security guardrail alerts.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all border border-slate-300 shadow-2xs"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-lg transition-all ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-lg transition-all ${
            filter === 'unread' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filtered.map((n) => {
          let Icon = Bell;
          let color = 'bg-blue-50 text-blue-600 border border-blue-200';

          if (n.type === 'access_request') {
            Icon = UserPlus;
            color = 'bg-purple-50 text-purple-600 border border-purple-200';
          } else if (n.type === 'doc_processed') {
            Icon = FileText;
            color = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
          } else if (n.type === 'blocked_attempt') {
            Icon = ShieldAlert;
            color = 'bg-red-50 text-red-600 border border-red-200';
          } else if (n.type === 'policy_upload') {
            Icon = ShieldCheck;
            color = 'bg-amber-50 text-amber-600 border border-amber-200';
          }

          return (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                n.read
                  ? 'bg-white border-slate-200 opacity-75'
                  : 'bg-blue-50/50 border-blue-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`p-2 rounded-lg ${color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center space-x-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {n.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    {n.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {n.link && (
                  <Link
                    href={n.link}
                    className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
