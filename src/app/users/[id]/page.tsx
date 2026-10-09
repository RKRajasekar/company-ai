'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Clock
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id as string;
  const { users, auditLogs } = useAuth();

  const user = users.find(u => u.id === userId) || users[0];
  const userLogs = auditLogs.filter(l => l.user === user.name || l.userEmail === user.email);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <Link href="/users" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to User Directory</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-2xs" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-3">
                <span>{user.name}</span>
                <StatusBadge status={user.status} size="sm" />
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Employee ID: {user.employeeId} • {user.designation}
              </p>
            </div>
          </div>
          <RoleBadge role={user.role} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <UserIcon className="w-4 h-4 text-blue-600" />
            <span>Personal Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2"><UserIcon className="w-3.5 h-3.5" /><span>Full Name</span></span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2"><Mail className="w-3.5 h-3.5" /><span>Work Email</span></span>
              <span className="font-mono text-blue-600 font-medium">{user.email}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2"><Phone className="w-3.5 h-3.5" /><span>Phone Number</span></span>
              <span className="font-mono text-slate-800">{user.phone}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center space-x-2"><Building className="w-3.5 h-3.5" /><span>Department</span></span>
              <span className="font-semibold text-slate-900">{user.department}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span>Organization & Role</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">System Role</span>
              <RoleBadge role={user.role} size="sm" />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Assigned Manager</span>
              <span className="font-medium text-slate-900">{user.manager}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Team Workspace</span>
              <span className="font-medium text-slate-900">{user.team}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 flex items-center space-x-2"><Calendar className="w-3.5 h-3.5" /><span>Joining Date</span></span>
              <span className="font-mono text-slate-800">{user.joiningDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Scope Badges */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & RAG Access Scope</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">AI Assistant</span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Allowed</span>
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">HR Documents</span>
            {['super_admin', 'hr_admin'].includes(user.role) ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Allowed</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-xs border border-amber-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted</span>
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Financial Documents</span>
            {['super_admin', 'manager'].includes(user.role) ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Allowed</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-xs border border-amber-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted</span>
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Admin Dashboard</span>
            {['super_admin', 'hr_admin'].includes(user.role) ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Allowed</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold text-xs border border-red-200">
                <XCircle className="w-3.5 h-3.5" />
                <span>Not Allowed</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Recent User Activity</span>
        </h2>

        <div className="space-y-3">
          {userLogs.length > 0 ? (
            userLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 flex items-center space-x-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({log.module})</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 text-center py-6">
              No recent audit events logged for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
