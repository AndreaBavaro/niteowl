import { NextRequest, NextResponse } from 'next/server';

// Security headers middleware for API routes
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CORS headers for waitlist endpoint only
  if (request.nextUrl.pathname === '/api/waitlist') {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*'
};
