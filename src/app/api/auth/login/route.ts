import { NextRequest, NextResponse } from 'next/server';

const STAFF_SESSION_COOKIE = 'staff_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Dev-only fallback when STAFF_PASSWORD is not set (never used in production)
const DEV_FALLBACK_PASSWORD = 'eaglehr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const staffPassword = process.env.STAFF_PASSWORD;
    const staffEmail = process.env.STAFF_EMAIL; // optional: restrict to one email
    const isProduction = process.env.NODE_ENV === 'production';

    // In production, STAFF_PASSWORD is required
    if (isProduction && !staffPassword) {
      console.error('STAFF_PASSWORD is not set');
      return NextResponse.json(
        { error: 'Staff login is not configured.' },
        { status: 500 }
      );
    }

    const effectivePassword = staffPassword || (isProduction ? '' : DEV_FALLBACK_PASSWORD);
    if (isProduction && !effectivePassword) {
      return NextResponse.json(
        { error: 'Staff login is not configured.' },
        { status: 500 }
      );
    }

    if (!effectivePassword || password !== effectivePassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (staffEmail && email?.toLowerCase() !== staffEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(STAFF_SESSION_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
