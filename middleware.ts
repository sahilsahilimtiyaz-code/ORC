import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware, detectThreats, validateRequest } from './lib/security';

// Security middleware for all routes
export async function middleware(request: NextRequest) {
  // Apply security checks
  const securityResponse = await securityMiddleware(request);
  
  // If security middleware returns a response, it means the request was blocked
  if (securityResponse) {
    return securityResponse;
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - textures (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|textures).*)',
  ],
};