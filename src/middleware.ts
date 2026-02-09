import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STAFF_SESSION_COOKIE = 'staff_session';
const LOGIN_PATH = '/dashboard/login';
const FORGOT_PASSWORD_PATH = '/dashboard/forgot-password';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes; allow login and forgot-password
  const isAuthPage = pathname.startsWith(LOGIN_PATH) || pathname.startsWith(FORGOT_PASSWORD_PATH);
  if (pathname.startsWith('/dashboard') && !isAuthPage) {
    const session = request.cookies.get(STAFF_SESSION_COOKIE);
    if (!session?.value) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
