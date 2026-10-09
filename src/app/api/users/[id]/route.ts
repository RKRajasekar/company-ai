import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth/security';
import { updateUserInDb } from '@/lib/userRegistry';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = req.cookies.get('companyai_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyAuthToken(sessionToken);
    if (!session || !['super_admin', 'hr_admin', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateUserInDb(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        employeeId: updated.employeeId,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        department: updated.department,
        designation: updated.designation,
        team: updated.team,
        manager: updated.managerName,
        status: updated.status,
        lastActive: updated.lastActive,
        joiningDate: updated.joiningDate,
        phone: updated.phone,
        avatar: updated.avatar,
        permissions: updated.permissions
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
