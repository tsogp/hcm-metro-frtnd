import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute, isGuestOnlyRoute, ROUTES } from "@/config/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies
  const token = request.cookies.get("auth_token")?.value;
  
  // If trying to access protected path without token
  if (isProtectedRoute(pathname) && !token) {
    const url = new URL(ROUTES.AUTH.LOGIN, request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  
  // If trying to access guest-only path with token
  if (isGuestOnlyRoute(pathname) && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 