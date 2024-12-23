// import { NextApiRequest, NextApiResponse } from "next";
// import { verifyToken } from "../../../utils/jwt";
// import { User } from "@prisma/client"; // นำเข้า User type จาก Prisma

// export const authenticate = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   next: Function
// ) => {
//   console.log("Middleware authenticate called");

//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.log("No token provided");
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = verifyToken(token);
//     console.log("Token verified:", payload);
//     console.log("testtttttttttttttttt");

//     req.user = payload as User;
//     next();
//   } catch (error) {
//     console.log("Token verification failed:", error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
