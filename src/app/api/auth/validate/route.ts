import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import API from "@/utils/axiosClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Forward the request to your backend
    const response = await API.get("/auth/validate-existing-email", {
      params: { email },
    });

    // Return the response from your backend
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Validation failed" },
      { status: error.response?.status || 500 }
    );
  }
}
