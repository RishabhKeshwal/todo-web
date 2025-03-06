import { NextResponse } from "next/server";
import connectDB from "../../../../db/dbConnect";
import Todo from "../../../../models/Todo.Model";
import { authenticate } from "../../../../middlewares/auth";

export async function DELETE(request) {
  try {
    await connectDB(); // Ensure database connection is inside the function

    const userId = await authenticate(request);
    if (userId instanceof NextResponse) return userId; // Handle authentication failure

    // Extract `id` from query parameters instead of `request.json()`
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Todo ID is required" },
        { status: 400 }
      );
    }

    // Ensure the todo belongs to the authenticated user
    const todo = await Todo.findOneAndDelete({ _id: id, userId });
    if (!todo) {
      return NextResponse.json(
        { message: "Todo not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
