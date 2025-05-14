import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import API from "@/utils/axiosClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Forward the request to your backend
    const response = await API.post("/auth/login", {
      email,
      password,
    }, {
      withCredentials: true,
    });

    // Return the response from your backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
