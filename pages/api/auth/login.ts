import { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { accessToken, user } = await loginUser({ email, password });
    return res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ message: "Invalid email or password" });
  }
}
