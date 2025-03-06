import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import User from "../../../../models/User.Model";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;

// Zod schema for validation
const registerSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .nonempty({ message: "Name is required" }),
  email: z
    .string()
    .email()
    .nonempty({ message: "Email is required" })
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6).nonempty({ message: "Password is required" }),
});

export async function POST(request) {
  try {
    // Validate JWT_SECRET
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Connect to database
    await connectDB();
    console.log("Connected to the database");

    // Parse and validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    const { name, email, password } = validatedData;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create and save new user
    user = new User({ name, email, password });
    try {
      await user.save();
    } catch (error) {
      console.error("Error saving user:", error.message, error.stack);
      if (error.code === 11000) {
        // Duplicate key error from MongoDB
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }
      throw error; // Rethrow if the error is not a duplicate key error
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Generated token:", token);

    // Return response with cookie
    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user._id, name: user.name, email: user.email },
      },
      {
        status: 201,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${
            NODE_ENV === "production" ? "; Secure" : ""
          }`,
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Register error:", error.message, error.stack);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
