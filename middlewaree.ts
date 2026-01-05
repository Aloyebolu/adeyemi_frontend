import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const userCookie = request.cookies.get('user');
  const tokenCookie = request.cookies.get('token');
  
  // If trying to access chat routes without authentication
  if (request.nextUrl.pathname.startsWith('/chat')) {
    if (!userCookie || !tokenCookie) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Parse user data to check roles
    try {
      const userData = JSON.parse(userCookie.value);
      
      // Check for admin route access
      if (request.nextUrl.pathname.startsWith('/chat/admin')) {
        if (userData.role !== 'admin') {
          return NextResponse.redirect(new URL('/chat', request.url));
        }
      }
      
      // Check for attendant route access
      if (request.nextUrl.pathname.startsWith('/chat/attendant')) {
        if (!userData.extra_roles?.includes('customer_service')) {
          return NextResponse.redirect(new URL('/chat', request.url));
        }
      }
    } catch {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*'],
};