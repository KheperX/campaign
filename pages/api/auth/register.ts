// pages/api/auth/register.ts
'use server'
import { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "../../../lib/auth"; // นำเข้า registerUser จาก lib/auth.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    console.log("ติดจ้า");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await registerUser({ email, password });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
}
