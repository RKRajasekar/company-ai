import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/hr/dashboard',
  '/manager/dashboard',
  '/team-lead/dashboard',
  '/employee/dashboard',
  '/ai-assistant',
  '/users',
  '/teams',
  '/roles',
  '/knowledge-base',
  '/analytics',
  '/audit-logs',
  '/settings',
  '/profile',
  '/notifications'
];

function decodeSessionToken(token: string): { email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const payloadStr = atob(parts[0]);
    const payload = JSON.parse(payloadStr);

    if (payload.expiresAt && payload.expiresAt < Date.now()) {
      return null;
    }

    return { email: payload.email, role: payload.role };
  } catch (err) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionToken = req.cookies.get('companyai_session')?.value;
  const isExplicitLoggedOut = req.cookies.get('companyai_logged_out')?.value === 'true';

  const session = (!isExplicitLoggedOut && sessionToken) ? decodeSessionToken(sessionToken) : null;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // 1. Root route handling
  if (pathname === '/') {
    if (session) {
      const target = session.role === 'super_admin' ? '/dashboard' :
                     session.role === 'hr_admin' ? '/hr/dashboard' :
                     session.role === 'manager' ? '/manager/dashboard' :
                     session.role === 'team_lead' ? '/team-lead/dashboard' :
                     session.role === 'ai_only_user' ? '/ai-assistant' : '/employee/dashboard';
      return NextResponse.redirect(new URL(target, req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 2. Prevent visiting /login if already authenticated
  if (pathname === '/login' && session) {
    const target = session.role === 'super_admin' ? '/dashboard' :
                   session.role === 'hr_admin' ? '/hr/dashboard' :
                   session.role === 'manager' ? '/manager/dashboard' :
                   session.role === 'team_lead' ? '/team-lead/dashboard' :
                   session.role === 'ai_only_user' ? '/ai-assistant' : '/employee/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  // 3. Strict authentication guard for protected routes
  if (isProtectedRoute) {
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access restrictions
    const role = session.role;

    // AI-Only User restriction: Access to AI Assistant page ONLY
    if (role === 'ai_only_user') {
      if (pathname !== '/ai-assistant' && !pathname.startsWith('/ai-assistant/')) {
        return NextResponse.redirect(new URL('/ai-assistant', req.url));
      }
      return NextResponse.next();
    }

    // Super Admin can access everything
    if (role === 'super_admin') {
      return NextResponse.next();
    }

    // Role specific unauthorized route checks
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (role === 'employee') {
      const employeeForbidden = ['/hr/dashboard', '/manager/dashboard', '/team-lead/dashboard', '/users', '/teams', '/roles', '/audit-logs', '/settings', '/analytics'];
      if (employeeForbidden.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    if (role === 'team_lead') {
      const leadForbidden = ['/hr/dashboard', '/manager/dashboard', '/users', '/roles', '/settings', '/analytics'];
      if (leadForbidden.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    if (role === 'manager') {
      const mgrForbidden = ['/hr/dashboard', '/team-lead/dashboard', '/roles', '/settings'];
      if (mgrForbidden.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    if (role === 'hr_admin') {
      const hrForbidden = ['/manager/dashboard', '/team-lead/dashboard', '/roles'];
      if (hrForbidden.some(r => pathname === r || pathname.startsWith(`${r}/`))) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/hr/dashboard/:path*',
    '/manager/dashboard/:path*',
    '/team-lead/dashboard/:path*',
    '/employee/dashboard/:path*',
    '/ai-assistant/:path*',
    '/users/:path*',
    '/teams/:path*',
    '/roles/:path*',
    '/knowledge-base/:path*',
    '/analytics/:path*',
    '/audit-logs/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/notifications/:path*'
  ]
};

