'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AdminTestResults } from './AdminTestResults';
import { 
  Users, 
  UserCheck, 
  Bot, 
  FileText, 
  ShieldAlert, 
  Plus, 
  Upload, 
  ShieldCheck, 
  Settings,
  FileSpreadsheet,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export function SuperAdminDashboard() {
  const { auditLogs } = useAuth();

  const adminModules = [
    { title: 'User Management', desc: 'Add, view, edit users and assign roles', href: '/users', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Roles & Permissions', desc: 'Configure system RBAC access policies', href: '/roles', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'AI Assistant', desc: 'Query authorized RAG vector search assistant', href: '/ai-assistant', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Knowledge Base', desc: 'Manage policy documents and PDF uploads', href: '/knowledge-base', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Teams', desc: 'Oversee department workspaces and members', href: '/teams', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Audit Logs', desc: 'Monitor security activity and login events', href: '/audit-logs', icon: FileSpreadsheet, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Settings', desc: 'Configure AI models and security policies', href: '/settings', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Super Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Super Admin
            </h1>
            <p className="text-xs text-slate-500">
              Manage organization users, roles, knowledge base documents, and system settings.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/users"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </Link>
            <Link
              href="/knowledge-base/upload"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-all"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload PDF</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Fully Collapsible Admin Login Test Results Section */}
      <AdminTestResults />

      {/* Admin Modules List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Available Modules ({adminModules.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map((mod) => {
            const IconComp = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all flex items-start space-x-3.5 group"
              >
                <div className={`p-2.5 rounded-lg ${mod.bg} ${mod.color} shrink-0`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center space-x-1">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent System Activity
            </h2>
            <p className="text-[11px] text-slate-500">
              Latest recorded audit log events
            </p>
          </div>
          <Link href="/audit-logs" className="text-xs text-blue-600 font-semibold hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{log.user}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-500">{log.module}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={log.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
