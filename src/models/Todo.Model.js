import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// export default mongoose.model("Todo", todoSchema);
// Export model, prevent redefinition in Next.js dev mode
export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);
