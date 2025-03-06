import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    // If already connected or connecting, return
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return mongoose.connection;
    }
    if (mongoose.connection.readyState === 2) {
      console.log("⏳ MongoDB connection is in progress...");
      return mongoose.connection;
    }

    // Ensure the MongoDB URI is available
    const mongoUri = process.env.MONGO_DB_URI;
    if (!mongoUri) {
      console.error(
        "❌ MONGO_DB_URI is missing! Define it in your environment variables."
      );
      throw new Error("MONGO_DB_URI is not defined in environment variables.");
    }

    console.log("🔗 Connecting to MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected Successfully!");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw error; // Allow caller to handle the error
  }
};

export default dbConnect;
