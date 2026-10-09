'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Permission, RoleDefinition } from '@/lib/types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  CheckCircle2,
  Save, 
  X, 
  Loader2,
  Users,
  Lock,
  Sliders,
  Plus
} from 'lucide-react';
import { PermissionGuard } from '@/components/common/PermissionGuard';

interface ManagedPermission {
  key: Permission;
  name: string;
  moduleKey: string;
  description: string;
}

const MANAGED_PERMISSIONS: ManagedPermission[] = [
  { key: 'view_dashboard', name: 'Dashboard', moduleKey: 'Dashboard', description: 'Access dashboard metrics, operational KPIs, and organization statistics.' },
  { key: 'use_ai', name: 'AI Assistant', moduleKey: 'AI Assistant', description: 'Query authorized company documents via RAG vector search and LLM.' },
  { key: 'manage_users', name: 'Users', moduleKey: 'Users', description: 'Manage employee accounts, directory entries, and user profiles.' },
  { key: 'manage_teams', name: 'Teams', moduleKey: 'Teams', description: 'Create and oversee department team workspaces and team rosters.' },
  { key: 'view_kb', name: 'Knowledge Base', moduleKey: 'Knowledge Base', description: 'Access, upload, and manage company knowledge documents.' },
  { key: 'view_analytics', name: 'Analytics', moduleKey: 'Analytics', description: 'View system usage metrics, LLM query analytics, and cost reports.' },
  { key: 'view_audit_logs', name: 'Audit Logs', moduleKey: 'Audit Logs', description: 'Monitor system activity, security audit logs, and access events.' },
  { key: 'manage_settings', name: 'Settings', moduleKey: 'Settings', description: 'Configure AI models, guardrail rules, security, and access controls.' }
];

export default function RolesPage() {
  const { roles, updateRolePermissions, createRole, currentRole } = useAuth();

  // State for active role being managed in drawer/modal
  const [managingRole, setManagingRole] = useState<RoleDefinition | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<Permission[]>([]);
  const [editedDescription, setEditedDescription] = useState<string>('');
  
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<Permission[]>(['view_dashboard', 'use_ai', 'view_kb']);

  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const handleOpenManage = (roleDef: RoleDefinition) => {
    setManagingRole(roleDef);
    setEditedPermissions([...roleDef.permissions]);
    setEditedDescription(roleDef.description);
    setSaveNotification(null);
  };

  const handleTogglePermission = (permKey: Permission) => {
    if (editedPermissions.includes(permKey)) {
      setEditedPermissions(prev => prev.filter(p => p !== permKey));
    } else {
      setEditedPermissions(prev => [...prev, permKey]);
    }
  };

  const handleSaveChanges = async () => {
    if (!managingRole) return;

    setIsSaving(true);
    setSaveNotification(null);

    // Simulate API request loading state
    await new Promise(resolve => setTimeout(resolve, 600));

    updateRolePermissions(managingRole.roleKey, editedPermissions);
    
    setIsSaving(false);
    setSaveNotification(`Successfully saved permissions for role "${managingRole.name}".`);

    // Keep user on page; auto-dismiss notification after 4 seconds
    setTimeout(() => {
      setSaveNotification(null);
    }, 4000);
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoleName.trim()) {
      createRole({
        name: newRoleName,
        description: newRoleDesc || 'Custom organization role definition.',
        permissions: newRolePerms
      });
      setNewRoleName('');
      setNewRoleDesc('');
      setShowCreateRoleModal(false);
      setSaveNotification(`Successfully created custom role "${newRoleName}".`);
      setTimeout(() => setSaveNotification(null), 4000);
    }
  };

  return (
    <PermissionGuard permission="roles">
      <div className="space-y-6 font-sans">
        {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" />
            <span>Roles & Permissions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system roles and control what each role can access.
          </p>
        </div>

        {currentRole === 'super_admin' && (
          <button
            onClick={() => setShowCreateRoleModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </button>
        )}
      </div>

      {saveNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotification}</span>
          </div>
          <button onClick={() => setSaveNotification(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          System Roles ({roles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((roleDef) => {
            const hasFullAccess = roleDef.roleKey === 'super_admin';
            const permCount = roleDef.permissions.length;

            return (
              <div 
                key={roleDef.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                        <span>{roleDef.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {roleDef.description}
                      </p>
                    </div>
                    <StatusBadge status={roleDef.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Users</span>
                      <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{roleDef.userCount} Active Users</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Permission Summary</span>
                      <span className="font-bold text-slate-800 mt-0.5 block truncate">
                        {hasFullAccess ? 'Full System Access' : `${permCount} Modules Allowed`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenManage(roleDef)}
                    className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 border border-blue-200"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Manage Role Permissions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Management Drawer / Modal */}
      {managingRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 space-y-0">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg text-white">
                    Manage Permissions: {managingRole.name}
                  </h3>
                  <RoleBadge role={managingRole.roleKey} size="sm" />
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Configure access control and feature permissions for users assigned to this role.
                </p>
              </div>
              <button 
                onClick={() => setManagingRole(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Details */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role Name</label>
                <input
                  type="text"
                  disabled
                  value={managingRole.name}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold text-xs cursor-not-allowed opacity-80"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role Description</label>
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Describe role responsibilities..."
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Permission Toggles List */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Module Permissions
              </h4>

              <div className="space-y-3">
                {MANAGED_PERMISSIONS.map((perm) => {
                  const isAllowed = editedPermissions.includes(perm.key);

                  return (
                    <div
                      key={perm.key}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between space-x-4 ${
                        isAllowed 
                          ? 'bg-blue-50/50 border-blue-200' 
                          : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900">
                            {perm.moduleKey}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isAllowed ? 'ALLOW' : 'DENY'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {perm.description}
                        </p>
                      </div>

                      {/* Allow / Deny Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAllowed ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isAllowed ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setManagingRole(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveChanges}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Define New Custom Role</span>
              </h3>
              <button onClick={() => setShowCreateRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role Description</label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and access scope..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700 block">Initial Permissions</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {MANAGED_PERMISSIONS.map(p => {
                    const checked = newRolePerms.includes(p.key);
                    return (
                      <label key={p.key} className="flex items-center space-x-2 cursor-pointer text-slate-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setNewRolePerms([...newRolePerms, p.key]);
                            else setNewRolePerms(newRolePerms.filter(k => k !== p.key));
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>{p.moduleKey}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-xs"
                >
                  Save & Create Role
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
