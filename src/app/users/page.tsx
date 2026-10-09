'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { User, UserRole, ALL_PERMISSION_OPTIONS, DEFAULT_ROLE_PERMISSIONS, PermissionKey } from '@/lib/types';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Ban, 
  X
} from 'lucide-react';

export default function UsersPage() {
  const { users, addUser, updateUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    role: 'employee' as UserRole,
    department: 'Human Resources',
    designation: 'Specialist',
    team: 'HR People Operations',
    permissions: DEFAULT_ROLE_PERMISSIONS['employee'] as PermissionKey[]
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    department: 'Human Resources',
    designation: 'Specialist',
    team: 'HR People Operations',
    permissions: [] as PermissionKey[]
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesDept = deptFilter === 'all' || u.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  const handleRoleChangeForNewUser = (newRole: UserRole) => {
    setNewUserData({
      ...newUserData,
      role: newRole,
      permissions: DEFAULT_ROLE_PERMISSIONS[newRole] || DEFAULT_ROLE_PERMISSIONS['employee']
    });
  };

  const handleToggleNewPermission = (permKey: PermissionKey) => {
    setNewUserData((prev) => {
      const exists = prev.permissions.includes(permKey);
      const updated = exists
        ? prev.permissions.filter((k) => k !== permKey)
        : [...prev.permissions, permKey];
      return { ...prev, permissions: updated };
    });
  };

  const handleToggleEditPermission = (permKey: PermissionKey) => {
    setEditUserData((prev) => {
      const exists = prev.permissions.includes(permKey);
      const updated = exists
        ? prev.permissions.filter((k) => k !== permKey)
        : [...prev.permissions, permKey];
      return { ...prev, permissions: updated };
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserData.name && newUserData.email) {
      addUser({
        ...newUserData,
        permissions: newUserData.permissions as any
      });
      setShowAddModal(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        role: 'employee',
        department: 'Human Resources',
        designation: 'Specialist',
        team: 'HR People Operations',
        permissions: DEFAULT_ROLE_PERMISSIONS['employee']
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser && editUserData.name && editUserData.email) {
      updateUser(editingUser.id, {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role,
        department: editUserData.department,
        designation: editUserData.designation,
        team: editUserData.team,
        permissions: editUserData.permissions as any
      });
      setEditingUser(null);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    const userPerms = (user.permissions && user.permissions.length > 0)
      ? user.permissions.map(p => p as PermissionKey)
      : DEFAULT_ROLE_PERMISSIONS[user.role] || DEFAULT_ROLE_PERMISSIONS['employee'];

    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      team: user.team,
      permissions: userPerms
    });
  };

  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Last Active'];
    const rows = filteredUsers.map(u => [u.employeeId, u.name, u.email, u.department, u.role, u.status, u.lastActive]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'companyai_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PermissionGuard permission="users">
      <div className="space-y-6 font-sans">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>User & Employee Directory</span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage organization users, role assignments, custom permissions, and account statuses.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard New User</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, or EMP ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="hr_admin">HR Admin</option>
                <option value="manager">Manager</option>
                <option value="team_lead">Team Lead</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
              >
                <option value="all">All Departments</option>
                <option value="Executive Office & Security">Executive Office & Security</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance & Compliance">Finance & Compliance</option>
                <option value="Sales & Growth">Sales & Growth</option>
                <option value="Customer Success">Customer Success</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">EMP ID</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                      No employees found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userPermsCount = (user.permissions && Array.isArray(user.permissions)) 
                      ? user.permissions.length 
                      : (DEFAULT_ROLE_PERMISSIONS[user.role] || []).length;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                          {user.employeeId}
                        </td>
                        <td className="py-3.5 px-4">
                          <Link href={`/users/${user.id}`} className="flex items-center space-x-3 group">
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {user.name}
                              </div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {user.department}
                        </td>
                        <td className="py-3.5 px-4">
                          <RoleBadge role={user.role} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                            {user.role === 'super_admin' ? 'All (Full Access)' : `${userPermsCount} Permitted`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={user.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Link
                              href={`/users/${user.id}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="p-1.5 rounded-md text-slate-500 hover:text-purple-600 hover:bg-slate-100"
                              title="Edit User & Permissions"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = user.status === 'active' ? 'disabled' : 'active';
                                updateUser(user.id, { status: newStatus });
                              }}
                              className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100"
                              title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Onboard New User</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john.miller@company.ai"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Password</label>
                    <input
                      type="password"
                      placeholder="Default: R@jasekar2004"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Role</label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => handleRoleChangeForNewUser(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold"
                    >
                      <option value="employee">Employee</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="manager">Manager</option>
                      <option value="hr_admin">HR Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                {/* Permissions Selection Section */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                      Permissions
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Select allowed access
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {ALL_PERMISSION_OPTIONS.map((option) => {
                      const isChecked = newUserData.permissions.includes(option.key);
                      return (
                        <label
                          key={option.key}
                          className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleNewPermission(option.key)}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <span className="truncate">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                  >
                    Create User & Assign Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User & Permissions Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-purple-600" />
                  <span>Edit User & Permissions</span>
                </h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editUserData.name}
                      onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      required
                      value={editUserData.email}
                      onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Role</label>
                    <select
                      value={editUserData.role}
                      onChange={(e) => {
                        const r = e.target.value as UserRole;
                        setEditUserData({
                          ...editUserData,
                          role: r,
                          permissions: DEFAULT_ROLE_PERMISSIONS[r] || editUserData.permissions
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold"
                    >
                      <option value="employee">Employee</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="manager">Manager</option>
                      <option value="hr_admin">HR Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Department</label>
                    <select
                      value={editUserData.department}
                      onChange={(e) => setEditUserData({ ...editUserData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                    >
                      <option value="Executive Office & Security">Executive Office & Security</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Compliance">Finance & Compliance</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales & Growth">Sales & Growth</option>
                      <option value="Customer Success">Customer Success</option>
                    </select>
                  </div>
                </div>

                {/* Edit Permissions Selection Section */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                      Assigned Permissions
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Check/uncheck allowed modules
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {ALL_PERMISSION_OPTIONS.map((option) => {
                      const isChecked = editUserData.permissions.includes(option.key);
                      return (
                        <label
                          key={option.key}
                          className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleEditPermission(option.key)}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <span className="truncate">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                  >
                    Save Changes
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
