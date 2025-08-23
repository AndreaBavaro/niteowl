import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/bars',
  '/search',
  '/for-you',
  '/submit-bar',
  '/community-reviews',
  '/admin',
  '/bar'
];

// Routes that should redirect authenticated users away
const authRoutes = ['/signup', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // PRODUCTION WAITLIST MODE: Only allow /waitlist and API routes
  if (process.env.NODE_ENV === 'production') {
    if (pathname !== '/waitlist' && !pathname.startsWith('/api/waitlist')) {
      return NextResponse.redirect(new URL('/waitlist', request.url));
    }
    return NextResponse.next();
  }

  // Handle mock mode - bypass authentication
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    console.log('[Middleware] Mock mode enabled, bypassing auth checks');
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Get user session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Middleware] Error getting user:', error);
    }

    const isAuthenticated = !!user && !error;
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    console.log('[Middleware]', {
      pathname,
      isAuthenticated,
      isProtectedRoute,
      isAuthRoute,
      userId: user?.id
    });

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      console.log('[Middleware] Redirecting to signup - not authenticated');
      const redirectUrl = new URL('/signup', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth routes
    if (isAuthRoute && isAuthenticated) {
      console.log('[Middleware] Redirecting to home - already authenticated');
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return response;
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
