import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  DASHBOARD_SESSION_COOKIE,
  verifyDashboardSessionToken,
} from '@/lib/dashboardSessionCrypto';
import { resolveDashboardSessionSecret } from '@/lib/dashboardSessionSecret';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/dashboard/login')) {
    return NextResponse.next();
  }

  const secret = resolveDashboardSessionSecret();
  if (!secret) {
    const login = new URL('/dashboard/login', request.url);
    login.searchParams.set('reason', 'misconfigured');
    return NextResponse.redirect(login);
  }

  const token = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  const ok = await verifyDashboardSessionToken(token ?? '', secret);
  if (!ok) {
    const login = new URL('/dashboard/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
