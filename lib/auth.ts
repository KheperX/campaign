import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Register a new user
 */
export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Normalize email
  const normalizedEmail = email.toLowerCase();

  // Validate email and password
  if (!validateEmail(normalizedEmail)) {
    throw new Error("Invalid email format");
  }
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  return newUser;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Normalize email
  const normalizedEmail = email.toLowerCase();

  // Validate email and password
  if (!validateEmail(normalizedEmail)) {
    throw new Error("Invalid email format");
  }
  if (!password) {
    throw new Error("Password is required");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate access token
  const accessToken = signToken(
    {
      userId: user.user_id,
      email: user.email,
      role: user.role,
    },
    "1h" 
  );

  return { accessToken, user };
}
