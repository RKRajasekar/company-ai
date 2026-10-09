'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  show: boolean;
}

interface NavSection {
  heading?: string;
  items: NavItem[];
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, logout, hasPermission } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // State to track which sections are expanded (true) or collapsed (false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    USERS: true,
    KNOWLEDGE: true,
    AI: true,
    SYSTEM: true
  });

  const toggleSection = (heading: string) => {
    setOpenSections(prev => ({
      ...prev,
      [heading]: !prev[heading]
    }));
  };

  const dashboardHref = 
    currentRole === 'super_admin' ? '/dashboard' :
    currentRole === 'hr_admin' ? '/hr/dashboard' :
    currentRole === 'manager' ? '/manager/dashboard' :
    currentRole === 'team_lead' ? '/team-lead/dashboard' :
    currentRole === 'ai_only_user' ? '/ai-assistant' : '/employee/dashboard';

  const userTitle = currentRole === 'hr_admin' ? 'Employees' : 'Users';
  const responsibilitiesTitle = currentRole === 'manager' || currentRole === 'team_lead' ? 'My Team' : 'Responsibilities';

  const navSections: NavSection[] = [
    {
      items: [
        { 
          title: 'Dashboard', 
          href: dashboardHref, 
          icon: LayoutDashboard, 
          show: hasPermission('dashboard') 
        }
      ]
    },
    {
      heading: 'USERS',
      items: [
        { 
          title: userTitle, 
          href: '/users', 
          icon: Users, 
          show: hasPermission('users') 
        },
        { 
          title: 'Roles & Permissions', 
          href: '/roles', 
          icon: ShieldCheck, 
          show: hasPermission('roles') 
        },
        { 
          title: responsibilitiesTitle, 
          href: '/teams', 
          icon: UserCheck, 
          show: hasPermission('teams') 
        }
      ]
    },
    {
      heading: 'KNOWLEDGE',
      items: [
        { 
          title: 'Knowledge Base', 
          href: '/knowledge-base', 
          icon: FileText, 
          show: hasPermission('knowledge-base') 
        }
      ]
    },
    {
      heading: 'AI',
      items: [
        { 
          title: 'AI Assistant', 
          href: '/ai-assistant', 
          icon: Bot, 
          show: hasPermission('ai-assistant') 
        }
      ]
    },
    {
      heading: 'SYSTEM',
      items: [
        { 
          title: 'Audit Logs', 
          href: '/audit-logs', 
          icon: FileSpreadsheet, 
          show: hasPermission('audit-logs') 
        },
        { 
          title: 'Notifications', 
          href: '/notifications', 
          icon: Bell, 
          show: currentRole !== 'ai_only_user' 
        },
        { 
          title: 'Settings', 
          href: '/settings', 
          icon: Settings, 
          show: hasPermission('settings') 
        }
      ]
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-white text-slate-800 border-r border-slate-200 shadow-sm transition-all duration-300 font-sans ${
          collapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Floating Circular Collapse Toggle Button (Matching Reference Image) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-6 z-50 w-7 h-7 rounded-full bg-blue-600 text-white items-center justify-center shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Brand Header */}
        <div className="pt-5 pb-3 px-4 flex items-center space-x-3 shrink-0">
          <Link href={dashboardHref} className="flex items-center space-x-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-extrabold text-base shadow-sm group-hover:bg-blue-700 transition-colors">
              CA
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-snug">
                  Company AI
                </span>
                <span className="text-xs text-slate-400 capitalize truncate font-medium">
                  {currentRole.replace('_', ' ')}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Search Bar Input (Matching Reference Image) */}
        {!collapsed && (
          <div className="px-3 py-1.5 shrink-0">
            <div className="relative flex items-center bg-slate-100/90 rounded-xl px-3 py-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                placeholder="Search..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
          </div>
        )}

        {/* Navigation Items (Matching Reference Image Pill Styling) */}
        <nav className="flex-1 py-2 px-3 space-y-1.5 overflow-y-auto font-sans">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter(item => item.show);
            if (visibleItems.length === 0) return null;

            const isSectionOpen = section.heading ? openSections[section.heading] ?? true : true;

            return (
              <div key={idx} className="space-y-1">
                {section.heading && !collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.heading!)}
                    className="w-full flex items-center justify-between px-3 py-1 mt-1 text-[13px] font-bold text-slate-700 hover:text-slate-900 uppercase tracking-wider transition-colors select-none group rounded-lg hover:bg-slate-50"
                  >
                    <span>{section.heading}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                        isSectionOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                )}

                {(isSectionOpen || collapsed) && (
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/hr/dashboard' && item.href !== '/manager/dashboard' && item.href !== '/team-lead/dashboard' && item.href !== '/employee/dashboard' && pathname.startsWith(`${item.href}/`));
                      const IconComp = item.icon;
                      const isSubItem = !!section.heading;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                          } ${collapsed ? 'justify-center px-0' : isSubItem ? 'pl-4' : 'pl-3'}`}
                          title={collapsed ? item.title : undefined}
                        >
                          <IconComp className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Separator Line */}
        <div className="px-3 shrink-0">
          <div className="border-t border-slate-200/80 my-1" />
        </div>

        {/* Footer Actions: Logout */}
        <div className="p-3 shrink-0 font-sans">
          {/* Logout Button */}
          <button
            onClick={logout}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-slate-500 hover:text-red-600 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}






