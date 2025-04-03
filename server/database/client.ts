import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model";

dotenv.config();

const uri = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(uri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    const admin = new User({
      firstName: "Admin",
      lastName: "01",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      isAdmin: true,
    });
    await admin.save();
    console.log(`✅ Admin créé : ${admin.email}`);
  }
};
