import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import Todo from "../../../../models/Todo.Model";
import { authenticate } from "../../../../middlewares/auth";

export async function PUT(request) {
  try {
    await connectDB(); // ✅ Move inside the function to avoid execution issues

    const userId = await authenticate(request);
    if (userId instanceof NextResponse) return userId; // ✅ Authentication check

    const body = await request.json();
    const { id, text, priority, date, completed } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Todo ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find the todo and ensure it belongs to the authenticated user
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) {
      return NextResponse.json(
        { message: "Todo not found or unauthorized" },
        { status: 404 }
      );
    }

    // ✅ Update only provided fields
    if (text !== undefined) todo.text = text;
    if (priority !== undefined) {
      const validPriorities = ["high", "medium", "low"];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { message: "Priority must be 'high', 'medium', or 'low'" },
          { status: 400 }
        );
      }
      todo.priority = priority;
    }
    if (date !== undefined) todo.date = new Date(date); // ✅ Ensure valid date format
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
