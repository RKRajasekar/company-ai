'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RoleBadge } from '@/components/common/RoleBadge';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  ShieldAlert,
  Calendar,
  UserCheck,
  Activity,
  AlertOctagon,
  RefreshCw,
  X
} from 'lucide-react';
import { AuditLogItem } from '@/lib/types';
import { PermissionGuard } from '@/components/common/PermissionGuard';

export default function AuditLogsPage() {
  const { auditLogs } = useAuth();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Error & Detail Modal States
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isErrorState, setIsErrorState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Derive unique users for filter dropdown
  const uniqueUsers = useMemo(() => {
    const set = new Set(auditLogs.map(l => l.user));
    return Array.from(set);
  }, [auditLogs]);

  // Statistics calculation
  const totalEvents = auditLogs.length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayEvents = auditLogs.filter(l => l.timestamp.startsWith(todayDateStr) || l.timestamp.includes('2026-10-05')).length;
  const blockedActions = auditLogs.filter(l => l.status === 'blocked').length;
  const activeUsersCount = uniqueUsers.length;

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery);

      const matchesDate = !dateFilter || log.timestamp.includes(dateFilter);
      const matchesUser = userFilter === 'all' || log.user === userFilter;
      const matchesRole = roleFilter === 'all' || log.role === roleFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      return matchesSearch && matchesDate && matchesUser && matchesRole && matchesModule && matchesStatus;
    });
  }, [auditLogs, searchQuery, dateFilter, userFilter, roleFilter, moduleFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setUserFilter('all');
    setRoleFilter('all');
    setModuleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
    setIsErrorState(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setIsErrorState(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['Date & Time', 'User', 'Role', 'Action', 'Module', 'Status', 'IP', 'Details'];
    const rows = filteredLogs.map(l => [l.timestamp, l.user, l.role, l.action, l.module, l.status, l.ip, `"${l.details}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'companyai_audit_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isErrorState) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm font-sans">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Something went wrong.</h2>
          <p className="text-xs text-slate-500">We couldn't load the audit logs from the security log index.</p>
        </div>
        <button
          onClick={handleRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <PermissionGuard permission="audit-logs">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              <span>Audit Logs</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor system activity and security events.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all border border-slate-300 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Total Events</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{totalEvents}</div>
            <p className="text-[11px] text-slate-400">Recorded system interactions</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Today's Events</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{todayEvents}</div>
            <p className="text-[11px] text-slate-400">Events logged today</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Blocked Actions</span>
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{blockedActions}</div>
            <p className="text-[11px] text-slate-400">PII or unauthorized attempts</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Active Users</span>
              <UserCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{activeUsersCount}</div>
            <p className="text-[11px] text-slate-400">Unique active log actors</p>
          </div>
        </div>

        {/* Filter Control Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by details, user name, action, or IP address..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          {/* Multi Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs pt-1 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date Filter</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">User Filter</label>
              <select
                value={userFilter}
                onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Role Filter</label>
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="hr_admin">HR Admin</option>
                <option value="manager">Manager</option>
                <option value="team_lead">Team Lead</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Module Filter</label>
              <select
                value={moduleFilter}
                onChange={(e) => { setModuleFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
              >
                <option value="all">All Modules</option>
                <option value="Authentication">Authentication</option>
                <option value="AI Assistant">AI Assistant</option>
                <option value="Knowledge Base">Knowledge Base</option>
                <option value="Role Management">Role Management</option>
                <option value="User Management">User Management</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="blocked">Blocked</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          {paginatedLogs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No matching audit logs found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to view all recorded security events.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Module</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Details</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <RoleBadge role={log.role} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {log.module}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={log.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <span className="font-bold">{filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="font-bold">{filteredLogs.length}</span> audit records
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold px-2">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span>Security Event Payload Details</span>
                </h3>
                <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Event ID</span>
                    <span className="font-mono font-bold text-slate-800">{selectedLog.id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Timestamp</span>
                    <span className="font-mono font-bold text-slate-800">{selectedLog.timestamp}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">User & Role</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{selectedLog.user} ({selectedLog.userEmail})</span>
                    <RoleBadge role={selectedLog.role} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Action</span>
                    <span className="font-bold text-slate-800">{selectedLog.action}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                    <StatusBadge status={selectedLog.status} size="sm" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">IP & Device Metadata</span>
                  <p className="font-mono text-slate-700">{selectedLog.ip} - {selectedLog.device}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Full Event Summary</span>
                  <p className="text-slate-800 font-mono text-[11px] leading-relaxed">{selectedLog.details}</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Close Payload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
