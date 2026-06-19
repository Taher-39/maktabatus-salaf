import mongoose from "mongoose";
import { env } from "./env";
import dns from "node:dns/promises";

export const connectDB = async (): Promise<void> => {
  try {
    // ensure reliable DNS for SRV lookups (matches app.ts)
    dns.setServers(["1.1.1.1", "1.0.0.1"]);

    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};