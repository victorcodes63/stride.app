import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getStaffSessionMaxAgeSeconds } from '@/lib/auth-session';
import { reportApiError } from '@/lib/monitoring';

const STAFF_SESSION_COOKIE = 'staff_session';
const COOKIE_MAX_AGE = getStaffSessionMaxAgeSeconds();
const ALLOWED_DOMAINS = (process.env.STAFF_ALLOWED_DOMAIN || 'example.com')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPassword = typeof password === 'string' ? password : '';

    const staffEmail = process.env.STAFF_EMAIL;
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured for staff login.' },
        { status: 503 }
      );
    }

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const domainOk = ALLOWED_DOMAINS.some((domain) => normalizedEmail.endsWith(`@${domain}`));
    if (!domainOk) {
      const domainHint =
        ALLOWED_DOMAINS.length === 1
          ? `Use your @${ALLOWED_DOMAINS[0]} email to sign in.`
          : 'Use an authorized staff email to sign in.';
      return NextResponse.json(
        { error: domainHint },
        { status: 401 }
      );
    }

    if (staffEmail && normalizedEmail !== staffEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'This email is not authorized for dashboard access.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'No staff account found for this email. Ask an admin to add you.' },
        { status: 401 }
      );
    }
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account is inactive. Contact an administrator.' },
        { status: 403 }
      );
    }
    const passwordOk = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(STAFF_SESSION_COOKIE, `local:${user.id}:${user.role}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;
  } catch (error) {
    await reportApiError({
      route: 'POST /api/auth/login',
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Unable to sign in right now. Please try again.' },
      { status: 500 }
    );
  }
}
