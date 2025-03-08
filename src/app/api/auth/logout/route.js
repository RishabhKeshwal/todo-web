import { NextResponse } from "next/server";

const NODE_ENV = process.env.NODE_ENV || "development";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the 'token' cookie (matching register route)
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: NODE_ENV === "production",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
