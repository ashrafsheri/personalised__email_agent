import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('MW:', req.nextUrl.pathname);          // <- must appear every hit

  // Allow the login page and login API through
  if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/api/login')) {
    return NextResponse.next();
  }

  // Block everything else unless cookie is present
  if (!req.cookies.get('paismo_auth')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Match EVERY request except static assets
export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};