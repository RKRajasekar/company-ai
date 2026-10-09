'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/context/AuthContext';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Check if current page is an authentication or standalone page
  const isAuthPage = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/unauthorized'
  ].some(route => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`)));

  // Render standalone page without sidebar or header if not authenticated or on auth pages
  if (!isAuthenticated || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Header setMobileOpen={setMobileOpen} />

        {/* Main Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0 overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} CompanyAI Inc. All rights reserved. Professional White Enterprise Theme.
        </footer>
      </div>
    </div>
  );
}
