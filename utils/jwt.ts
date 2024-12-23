import jwt, { JwtPayload } from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET environment variable is not set.");
}

// Sign JWT
export const signToken = (payload: object, expiresIn = "12h"): string => {
  return jwt.sign(payload, TOKEN_SECRET, {
    expiresIn,
    algorithm: "HS256",
  });
};

// Verify JWT
export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Token is invalid");
    }
    throw new Error("Failed to verify token");
  }
};
