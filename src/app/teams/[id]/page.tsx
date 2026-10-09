'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DashboardCard } from '@/components/common/DashboardCard';
import { 
  Users, 
  Bot, 
  FileText, 
  TrendingUp, 
  Briefcase, 
  ArrowLeft,
  Activity
} from 'lucide-react';

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params?.id as string;
  const { teams, users, documents, auditLogs } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'documents' | 'activity'>('overview');

  const team = teams.find(t => t.id === teamId) || teams[0];
  const members = users.filter(u => u.team === team.name || u.department === team.department);
  const teamDocs = documents.filter(d => d.department === team.department || d.accessLevel === 'Internal');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <Link href="/teams" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teams Directory</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              {team.department} Department
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {team.name}
            </h1>
            <p className="text-xs text-slate-500">
              {team.description}
            </p>
          </div>
          <StatusBadge status={team.status} size="md" />
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Team Overview', icon: Briefcase },
          { id: 'members', label: `Members (${members.length})`, icon: Users },
          { id: 'documents', label: `Documents (${teamDocs.length})`, icon: FileText },
          { id: 'activity', label: 'Recent Activity', icon: Activity },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard title="Team Members" value={members.length} icon={Users} label="Active roster" />
            <DashboardCard title="AI Queries Count" value={team.aiQueriesCount} icon={Bot} label="Total processed" />
            <DashboardCard title="Team RAG Docs" value={teamDocs.length} icon={FileText} label="Indexed in vector DB" />
            <DashboardCard title="Work Efficiency" value="98.2%" icon={TrendingUp} label="Task completion rate" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Leadership Oversight
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 font-medium">Department Manager</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{team.manager}</div>
                  </div>
                  <RoleBadge role="manager" size="sm" />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 font-medium">Team Lead</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{team.teamLead}</div>
                  </div>
                  <RoleBadge role="team_lead" size="sm" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top RAG Knowledge Topics
              </h2>
              <div className="space-y-2 text-xs">
                {teamDocs.slice(0, 3).map(d => (
                  <div key={d.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-semibold text-slate-900">{d.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{d.snippet}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      {activeTab === 'members' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Team Roster ({members.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Member</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center space-x-2">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span>{m.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{m.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{m.designation}</td>
                    <td className="py-3 px-3"><RoleBadge role={m.role} size="sm" /></td>
                    <td className="py-3 px-3 font-mono text-slate-500">{m.lastActive}</td>
                    <td className="py-3 px-3"><StatusBadge status={m.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Team Repository Documents ({teamDocs.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamDocs.map(doc => (
              <div key={doc.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{doc.title}</span>
                  <StatusBadge status={doc.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500">{doc.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Team Activity Log
          </h2>

          <div className="space-y-3 text-xs">
            {auditLogs.slice(0, 5).map(l => (
              <div key={l.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{l.user} • {l.action}</div>
                  <div className="text-[11px] text-slate-500">{l.details}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{l.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
