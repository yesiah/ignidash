import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSessionCookie } from 'better-auth/cookies';

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isAuthPage = ['/signin', '/signup', '/forgot-password'].some((path) => request.nextUrl.pathname.startsWith(path));
  if (sessionCookie && isAuthPage) return NextResponse.redirect(new URL('/dashboard', request.url));

  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/settings');
  if (!sessionCookie && isProtectedPage)
    return NextResponse.redirect(new URL(`/signin?redirect=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/forgot-password', '/dashboard/:path*', '/settings'],
};
