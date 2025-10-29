import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@/lib/auth-server';

export async function middleware(request: NextRequest) {
  const token = await getToken();
  if (token) return NextResponse.redirect(new URL('/dashboard/quick-plan', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/forgot-password'],
};
