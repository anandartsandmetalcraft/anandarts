import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://anandartsandmetalcrafts.com', 'https://www.anandartsandmetalcrafts.com']
  : ['http://localhost:3000'];

// Basic in-memory rate limiting map for middleware (Edge runtime compatible, though volatile across instances)
const ipRequestCounts = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT_MAX = 200; // 200 requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const origin = request.headers.get('origin') ?? '';

  // 1. CORS Configuration for API routes
  if (path.startsWith('/api/')) {
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // 2. Strict Security Headers
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Cross-Site Scripting (XSS) Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // 3. Simple IP-based Rate Limiting for API routes
  if (path.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    if (ip !== 'unknown') {
      const current = ipRequestCounts.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
      
      // Reset if window has passed
      if (now > current.resetAt) {
        current.count = 1;
        current.resetAt = now + RATE_LIMIT_WINDOW_MS;
      } else {
        current.count++;
      }
      
      ipRequestCounts.set(ip, current);

      // Set RateLimit Headers
      response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX - current.count).toString());

      if (current.count > RATE_LIMIT_MAX) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }), 
          { 
            status: 429, 
            headers: { 'Content-Type': 'application/json', ...Object.fromEntries(response.headers) }
          }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. svg, png)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
