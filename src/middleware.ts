import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/config/routes";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "./store/user-store";

interface JwtToken {
  exp: number;
}

const passengerOnlyRoutes = ["/profile", "/invoices"];

const landingToDashboardRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const referer = request.headers.get("referer");
  const token = request.cookies.get("user_auth")?.value;

  if (
    isLandingToDashboardRoute(pathname) &&
    referer?.includes(ROUTES.LANDING)
  ) {
    if (!token) {
      const url = new URL(ROUTES.AUTH.LOGIN, request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isPassengerOnlyRoute(pathname)) {
    if (!token) {
      const url = new URL(ROUTES.AUTH.LOGIN, request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    if (isTokenExpired(token)) {
      const response = NextResponse.redirect(
        new URL(ROUTES.AUTH.LOGIN, request.url)
      );
      response.cookies.delete("user_auth");
      return response;
    }
  }

  if (isAuthenticationRoute(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  return NextResponse.next();
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch {
    return true;
  }
}

function isPassengerOnlyRoute(pathname: string): boolean {
  return passengerOnlyRoutes.some((route) => pathname.startsWith(route));
}

function isAuthenticationRoute(pathname: string): boolean {
  return pathname === ROUTES.AUTH.LOGIN || pathname === ROUTES.AUTH.REGISTER;
}

function isLandingToDashboardRoute(pathname: string): boolean {
  return landingToDashboardRoutes.some((route) => pathname.startsWith(route));
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
