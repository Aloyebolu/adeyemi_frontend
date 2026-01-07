import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const isMaintenancePage = request.nextUrl.pathname === "/maintenance";

  // If maintenance mode is ON and user is NOT on maintenance page
  if (maintenance && !isMaintenancePage) {
    // Redirect to maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // If maintenance mode is OFF and user IS on maintenance page
  if (!maintenance && isMaintenancePage) {
    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (logo.png, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|css|js)$).*)",
  ],
};