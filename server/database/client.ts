import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import argon2 from 'argon2';
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
  const adminExists = await User.findOne({ email: "admin@example.com" });
  if (!adminExists) {
    const hashedPassword = await argon2.hash("admin1234");
    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true
    });
    await admin.save();
    console.log(`✅ Admin créé : ${admin.email} / ${hashedPassword}`);
  }
};

