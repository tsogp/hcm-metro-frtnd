import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import API from "@/utils/axiosClient";

export async function POST(request: NextRequest) {
  try {
    // Forward the request to your backend
    await API.post("/auth/logout");

    // Create response with cleared cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth_token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Logout failed" },
      { status: error.response?.status || 500 }
    );
  }
}
