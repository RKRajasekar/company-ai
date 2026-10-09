'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RoleBadge } from '@/components/common/RoleBadge';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Bot, 
  UserPlus, 
  Plus,
  ArrowRight
} from 'lucide-react';

export function HRAdminDashboard() {
  const { users, documents } = useAuth();
  const hrDocs = documents.filter(d => d.department === 'Human Resources' || d.category === 'HR Policies');

  const hrModules = [
    { title: 'Employees Directory', desc: 'View employee list, roles, and onboarding status', href: '/users', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Teams Workspaces', desc: 'Oversee department teams and employee rosters', href: '/teams', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'HR Knowledge Base', desc: 'Policy manuals, employee handbooks, and documents', href: '/knowledge-base', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'AI Assistant', desc: 'Query authorized HR policy knowledge base', href: '/ai-assistant', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>HR Management Workspace</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, HR Manager
            </h1>
            <p className="text-xs text-slate-500">
              Access employee management tools, HR policy documents, and AI assistant resources.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/users"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </Link>
            <Link
              href="/knowledge-base/upload"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Upload HR Policy</span>
            </Link>
          </div>
        </div>
      </div>

      {/* HR Modules */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          HR Operations & Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hrModules.map((mod) => {
            const IconComp = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all space-y-3 group"
              >
                <div className={`w-10 h-10 rounded-lg ${mod.bg} ${mod.color} flex items-center justify-center shrink-0`}>
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

      {/* HR Directory Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Employees Directory Summary
            </h2>
            <p className="text-[11px] text-slate-500">
              Active company employees and assigned roles
            </p>
          </div>
          <Link href="/users" className="text-xs text-blue-600 font-semibold hover:underline">
            View All Employees →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Employee ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.slice(0, 5).map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-600">{u.employeeId}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{u.department}</td>
                  <td className="py-2.5 px-3"><RoleBadge role={u.role} size="sm" /></td>
                  <td className="py-2.5 px-3"><StatusBadge status={u.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
