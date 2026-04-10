import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // collabs.onlymatt.ca → rewrite to /collabs
  if (hostname.startsWith('collabs.')) {
    // If already on /collabs path, let it through
    if (pathname.startsWith('/collabs')) {
      return NextResponse.next();
    }
    // Rewrite root and all other paths to /collabs
    const url = request.nextUrl.clone();
    url.pathname = `/collabs${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip middleware for static files, images, and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
