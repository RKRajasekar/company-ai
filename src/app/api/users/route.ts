import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth/security';
import { getAllPersistentUsers, registerUserByAdmin } from '@/lib/userRegistry';

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('companyai_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyAuthToken(sessionToken);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized or expired session' }, { status: 401 });
    }

    // Restrict ai_only_user from viewing directory
    if (session.role === 'ai_only_user') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await getAllPersistentUsers();
    
    // Strip sensitive fields before returning to client
    const safeUsers = users.map(u => ({
      id: u.id,
      employeeId: u.employeeId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      designation: u.designation,
      team: u.team,
      manager: u.managerName,
      status: u.status,
      lastActive: u.lastActive,
      joiningDate: u.joiningDate,
      phone: u.phone,
      avatar: u.avatar,
      permissions: u.permissions
    }));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('companyai_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyAuthToken(sessionToken);
    if (!session || !['super_admin', 'hr_admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, department, designation, team, permissions } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required.' }, { status: 400 });
    }

    const result = await registerUserByAdmin({
      name,
      email,
      password,
      role,
      department,
      designation,
      team,
      permissions
    });

    if (!result.success || !result.user) {
      return NextResponse.json({ error: result.error || 'Failed to create user' }, { status: 400 });
    }

    const u = result.user;
    return NextResponse.json({
      success: true,
      user: {
        id: u.id,
        employeeId: u.employeeId,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        designation: u.designation,
        team: u.team,
        manager: u.managerName,
        status: u.status,
        lastActive: u.lastActive,
        joiningDate: u.joiningDate,
        phone: u.phone,
        avatar: u.avatar,
        permissions: u.permissions
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
