'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleBadge } from '@/components/common/RoleBadge';
import { 
  Search, 
  Bell, 
  Menu, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (val: boolean) => void;
}

export function Header({ setMobileOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, notifications, markAllNotificationsRead, logout } = useAuth();

  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Organization Dashboard Overview',
    '/hr/dashboard': 'HR Operations Dashboard',
    '/manager/dashboard': 'Department Manager Dashboard',
    '/team-lead/dashboard': 'Team Lead Dashboard',
    '/employee/dashboard': 'Employee Workspace Dashboard',
    '/ai-assistant': 'CompanyAI RAG Assistant',
    '/users': 'User & Employee Directory',
    '/teams': 'Team Workspaces',
    '/roles': 'Roles & Access Control Matrix (RBAC)',
    '/knowledge-base': 'Company Knowledge Base',
    '/knowledge-base/upload': 'Upload Document to RAG Index',
    '/audit-logs': 'Audit & Security Activity Logs',
    '/notifications': 'Notification Center',
    '/profile': 'Employee Profile Settings',
    '/settings': 'System & Guardrail Settings',
    '/unauthorized': 'Access Restricted'
  };

  const currentTitle = pageTitles[pathname] || 'Enterprise Workspace';

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between font-sans">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right Actions: Search, Quick Role Switcher (Admin Only), Notifications, User Avatar */}
      <div className="flex items-center space-x-3">
        {/* Search bar (Hidden for AI-Only users) */}
        {currentRole !== 'ai_only_user' && (
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              placeholder="Search employees, docs, policies... (Press Enter)"
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        )}

        {/* Notification Bell (Hidden for AI-Only users) */}
        {currentRole !== 'ai_only_user' && (
          <div className="relative">
            <button
              onClick={() => {
                setNotifMenuOpen(!notifMenuOpen);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs space-y-1 ${
                        n.read ? 'bg-slate-50 opacity-75' : 'bg-blue-50/70 border-l-2 border-blue-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{n.description}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/notifications"
                  onClick={() => setNotifMenuOpen(false)}
                  className="block text-center text-xs text-blue-600 font-medium pt-2 border-t border-slate-100 hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        )}

        {/* User Profile Avatar & Direct Sign Out */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* User Profile Info Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotifMenuOpen(false);
              }}
              className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="hidden sm:flex flex-col min-w-0 max-w-[140px] md:max-w-[180px] lg:max-w-[220px]">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </span>
                  <RoleBadge role={currentRole} size="sm" />
                </div>
                <span className="text-[11px] text-slate-500 truncate font-mono">
                  {currentUser.email}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
            </button>

            {/* User Profile Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center space-x-3">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex flex-col truncate min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</span>
                    <div className="mt-1">
                      <RoleBadge role={currentRole} size="sm" />
                    </div>
                  </div>
                </div>

                {currentRole !== 'ai_only_user' && (
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                )}

                {['super_admin', 'hr_admin'].includes(currentRole) && (
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </Link>
                )}

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Prominent Direct Sign Out Button */}
          <button
            onClick={() => logout()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
            title="Sign Out of CompanyAI"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
