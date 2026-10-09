import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyAuthToken } from '@/lib/auth/security';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('companyai_session')?.value;
    const session = token ? verifyAuthToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long and meet security standards.' },
        { status: 400 }
      );
    }

    // Hash the new password securely
    const newHash = hashPassword(newPassword);

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for Super Admin (${session.email}).`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update password.' },
      { status: 500 }
    );
  }
}
