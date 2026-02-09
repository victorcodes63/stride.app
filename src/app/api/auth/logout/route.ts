import { NextResponse } from 'next/server';

const STAFF_SESSION_COOKIE = 'staff_session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('staff_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
