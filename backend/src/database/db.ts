import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongodb_url = process.env.MONGO_URI || "";

    if (!process.env.MONGO_URI) {
      throw new Error("Mongo URI not found");
    }
    await mongoose.connect(mongodb_url);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
