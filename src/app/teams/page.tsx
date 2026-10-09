'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  UserCheck, 
  Users, 
  Bot, 
  FileText, 
  Plus,
  ArrowRight,
  X
} from 'lucide-react';
import { PermissionGuard } from '@/components/common/PermissionGuard';

export default function TeamsPage() {
  const { teams, addTeam, currentRole, currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('Engineering');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  const visibleTeams = ['super_admin', 'hr_admin'].includes(currentRole)
    ? teams
    : teams.filter(t => t.manager === currentUser.name || t.teamLead === currentUser.name || t.name === currentUser.team);

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      addTeam({
        name: newTeamName,
        department: newTeamDept,
        description: newTeamDesc || 'Department workspace for team operations.',
        manager: currentUser.name,
        teamLead: currentUser.name,
        memberCount: 1,
        documentCount: 0
      });
      setNewTeamName('');
      setNewTeamDesc('');
      setShowCreateModal(false);
    }
  };

  return (
    <PermissionGuard permission="teams">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <span>Team Workspaces</span>
            </h1>
            <p className="text-xs text-slate-500">
              Departmental teams, team leads, member counts, and team RAG document repositories.
            </p>
          </div>

          {['super_admin', 'hr_admin', 'manager'].includes(currentRole) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Team</span>
            </button>
          )}
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {team.department}
                  </span>
                  <StatusBadge status={team.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {team.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 text-xs border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department Manager:</span>
                    <span className="font-semibold text-slate-800">{team.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Team Lead:</span>
                    <span className="font-semibold text-slate-800">{team.teamLead}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <Users className="w-3.5 h-3.5 text-blue-600 mx-auto" />
                    <div className="font-bold text-slate-900 mt-1">{team.memberCount}</div>
                    <div className="text-[10px] text-slate-400">Members</div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <Bot className="w-3.5 h-3.5 text-purple-600 mx-auto" />
                    <div className="font-bold text-slate-900 mt-1">{team.aiQueriesCount}</div>
                    <div className="text-[10px] text-slate-400">Queries</div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                    <div className="font-bold text-slate-900 mt-1">{team.documentCount}</div>
                    <div className="text-[10px] text-slate-400">Docs</div>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href={`/teams/${team.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-2xs"
                >
                  <span>View Team Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Create New Team Workspace</span>
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Security & Risk"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department</label>
                  <select
                    value={newTeamDept}
                    onChange={(e) => setNewTeamDept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Compliance">Finance & Compliance</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Scope of work and document permissions..."
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
