import { NextResponse, type NextRequest } from 'next/server';

import { getToken } from '@/lib/auth-server';

export async function proxy(request: NextRequest) {
  const token = await getToken();

  const isAuthPage = ['/signin', '/signup', '/forgot-password'].some((path) => request.nextUrl.pathname.startsWith(path));
  if (token && isAuthPage) return NextResponse.redirect(new URL('/dashboard', request.url));

  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/settings');
  if (!token && isProtectedPage)
    return NextResponse.redirect(new URL(`/signin?redirect=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/forgot-password', '/dashboard/:path*', '/settings'],
};
