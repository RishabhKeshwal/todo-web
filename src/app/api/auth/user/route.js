import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "../../../../db/dbConnect";
import User from "../../../../models/User.Model";
import jwt from "jsonwebtoken";

await connectDB();

export async function GET(request) {
  try {
    const cookieStore = await cookies(); // Get cookies from the request
    const token = cookieStore.get("token")?.value; // Extract token from cookies

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
