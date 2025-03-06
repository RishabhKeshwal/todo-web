import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear authentication cookie (adjust the cookie name if needed)
    response.cookies.set("auth_token", "", { path: "/", expires: new Date(0) });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
