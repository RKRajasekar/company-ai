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
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function TeamLeadDashboard() {
  const { teams, users } = useAuth();
  const myTeam = teams[0];
  const teamMembers = users.filter(u => u.team === myTeam.name);

  const teamLeadModules = [
    { title: 'My Team Members', desc: 'Coordinate team project tasks and roster', href: '/teams', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Shared Documents', desc: 'Access team knowledge base and file resources', href: '/knowledge-base', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'AI Assistant', desc: 'Query authorized RAG AI vector knowledge base', href: '/ai-assistant', icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Team Lead Hub</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Team Lead
            </h1>
            <p className="text-xs text-slate-500">
              Coordinate team projects, shared knowledge documents, and AI assistant queries.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/ai-assistant"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Team Lead Modules */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Team Lead Options
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teamLeadModules.map((mod) => {
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

      {/* Team Members List */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Team Roster ({myTeam.name})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {teamMembers.map(m => (
            <div key={m.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                <div>
                  <div className="font-semibold text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-500">{m.designation}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RoleBadge role={m.role} size="sm" />
                <StatusBadge status={m.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
