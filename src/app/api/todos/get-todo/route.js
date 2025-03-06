import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import Todo from "../../../../models/Todo.Model";
import { authenticate } from "../../../../middlewares/auth";

// Connect to MongoDB
await connectDB();

export async function GET(request) {
  try {
    const userId = await authenticate(request);
    if (userId instanceof NextResponse) return userId; // Return error response if auth fails

    const todos = await Todo.find({ userId }).sort({ date: -1 }); // Sort by date descending
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
