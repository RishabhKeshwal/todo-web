import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import User from "../../../../models/User.Model";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";

// Zod schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .email()
    .nonempty({ message: "Email is required" })
    .transform((val) => val.toLowerCase()),
  password: z.string().nonempty({ message: "Password is required" }),
});

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json(
      {
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      },
      {
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${
            NODE_ENV === "production" ? "; Secure" : ""
          }`,
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
