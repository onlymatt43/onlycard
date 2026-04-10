import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // collabs.onlymatt.ca → rewrite to /collabs
  if (hostname.startsWith('collabs.')) {
    if (pathname.startsWith('/collabs')) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = `/collabs${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // book.onlymatt.ca → rewrite to /book
  if (hostname.startsWith('book.')) {
    if (pathname.startsWith('/book')) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = `/book${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip middleware for static files, images, and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
