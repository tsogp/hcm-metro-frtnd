import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("user_auth")?.value;

  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  if (isTokenExpired(token)) {
    return new NextResponse(null, { status: 401 });
  }

  return new NextResponse(null, { status: 200 });
}
