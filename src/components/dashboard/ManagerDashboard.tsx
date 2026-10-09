'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Users, 
  Bot, 
  FileText, 
  Briefcase, 
  UserCheck,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export function ManagerDashboard() {
  const { currentUser, teams, users } = useAuth();
  const myTeam = teams[0];
  const teamMembers = users.filter(u => u.team === myTeam.name || u.department === currentUser.department);

  const managerModules = [
    { title: 'My Team Workspace', desc: 'Oversee team members, rosters, and designations', href: '/teams', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Team Documents', desc: 'Access policy documents and team file resources', href: '/knowledge-base', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'AI Assistant', desc: 'Query company policy vector search engine', href: '/ai-assistant', icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Manager Workspace</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Department Manager
            </h1>
            <p className="text-xs text-slate-500">
              Oversight for team members, knowledge documents, and departmental operations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/teams"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Users className="w-4 h-4" />
              <span>My Team Workspace</span>
            </Link>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-all"
            >
              <Bot className="w-4 h-4 text-slate-500" />
              <span>Team AI Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Manager Modules */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Manager Options & Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {managerModules.map((mod) => {
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

      {/* Team Roster Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Team Roster ({myTeam.name})</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Department team members and activity
            </p>
          </div>
          <Link href="/teams" className="text-xs text-blue-600 font-semibold hover:underline">
            Manage Team →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Designation</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{m.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{m.designation}</td>
                  <td className="py-2.5 px-3"><RoleBadge role={m.role} size="sm" /></td>
                  <td className="py-2.5 px-3"><StatusBadge status={m.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
