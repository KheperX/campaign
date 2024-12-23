'use server'
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signToken, verifyToken } from "../utils/jwt";
import { cookies } from 'next/headers'

const prisma = new PrismaClient();

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const normalizedEmail = email.toLowerCase();

  if (!validateEmail(normalizedEmail)) {
    throw new Error("Invalid email format");
  }
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

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
  const normalizedEmail = email.toLowerCase();

  if (!validateEmail(normalizedEmail)) {
    throw new Error("Invalid email format");
  }
  if (!password) {
    throw new Error("Password is required");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = signToken(
    {
      userId: user.user_id,
      email: user.email,
      role: user.role,
    },
    "1h"
  );

  // Set the token in an HTTP-only cookie
  cookies().set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  });

  return { user };
}

export async function logoutUser() {
  cookies().delete('token');
}

export async function getCurrentUser() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export { verifyToken };

