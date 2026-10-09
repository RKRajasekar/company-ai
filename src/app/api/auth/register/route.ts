import { NextRequest, NextResponse } from 'next/server';
import { registerNewEmployee } from '@/lib/userRegistry';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const res = await registerNewEmployee(name, email, password);

    if (!res.success || !res.user) {
      return NextResponse.json(
        { error: res.error || 'Registration failed. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account Created Successfully',
      user: {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
