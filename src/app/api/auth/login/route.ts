import { NextRequest, NextResponse } from 'next/server';
import { generateAuthToken, verifyPassword } from '@/lib/auth/security';
import { UserRole } from '@/lib/types';
import { findUserByEmail } from '@/lib/userRegistry';

function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return '/dashboard';
    case 'hr_admin':
      return '/hr/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'team_lead':
      return '/team-lead/dashboard';
    case 'employee':
      return '/employee/dashboard';
    case 'ai_only_user':
      return '/ai-assistant';
    default:
      return '/ai-assistant';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if account exists
    const existingUser = await findUserByEmail(cleanEmail);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Account not found. Please register first.', notFound: true },
        { status: 404 }
      );
    }

    // 2. Check if password is correct
    if (!verifyPassword(password, existingUser.passwordHash, existingUser.salt)) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = existingUser;

    const token = generateAuthToken(user.email, user.role);
    const redirectTo = getDashboardRouteForRole(user.role);

    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        designation: user.designation,
        permissions: user.permissions
      }
    });

    // Set HTTP-only session cookie
    response.cookies.set('companyai_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400
    });

    // Clear explicit logout cookie flag
    response.cookies.set('companyai_logged_out', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 500 }
    );
  }
}
