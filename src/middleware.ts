import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute, isGuestOnlyRoute, ROUTES } from "@/config/routes";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  roles: [
    {
      authority: string;
    }
  ];
  userId: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
}

// Define passenger-only routes
const passengerOnlyRoutes = [
  "/profile",
  "/ticket",
  "/payment",
  "/ticket/purchase",
  "/ticket/my-tickets",
  "/payment/history",
  "/payment/top-up",
] as const;

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  } catch {
    return true;
  }
}

function isPassenger(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.roles[0].authority === "PASSENGER";
  } catch {
    return false;
  }
}

function isPassengerOnlyRoute(pathname: string): boolean {
  return passengerOnlyRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the auth token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // Handle passenger-only routes
  if (isPassengerOnlyRoute(pathname)) {
    if (!token) {
      // No token, redirect to login
      const url = new URL(ROUTES.AUTH.LOGIN, request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Check token expiration
    if (isTokenExpired(token)) {
      // Token expired, clear cookie and redirect to login
      const response = NextResponse.redirect(
        new URL(ROUTES.AUTH.LOGIN, request.url)
      );
      response.cookies.delete("auth_token");
      return response;
    }

    // Check if user is a passenger
    if (!isPassenger(token)) {
      // Not a passenger, redirect to home
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
  }

  // Handle guest-only routes (login, register, etc.)
  if (isGuestOnlyRoute(pathname) && token) {
    // If user is already logged in, redirect to home
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
