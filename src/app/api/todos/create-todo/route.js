import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import Todo from "../../../../models/Todo.Model";
import { authenticate } from "../../../../middlewares/auth";

await connectDB();

export async function POST(request) {
  try {
    const userId = await authenticate(request);
    if (userId instanceof NextResponse) return userId;

    const body = await request.json();
    const { text, priority, date } = body;

    if (!text || !date) {
      return NextResponse.json(
        { message: "Text and date are required" },
        { status: 400 }
      );
    }

    const validPriorities = ["high", "medium", "low"];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { message: "Priority must be 'high', 'medium', or 'low'" },
        { status: 400 }
      );
    }

    const todo = new Todo({
      userId,
      text,
      priority: priority || "medium",
      date: new Date(date),
      completed: false,
    });

    await todo.save();
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
