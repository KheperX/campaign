import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const origin = req.headers.get("origin");

  if (origin === "http://localhost:4000") {
    res.headers.set("Access-Control-Allow-Origin", "http://localhost:4000");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 });
  }

  if (req.nextUrl.pathname.startsWith("/authenticated")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      req.headers.set("X-User-Id", decoded.userId);
      req.headers.set("X-User-Role", decoded.role);
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/authenticated/:path*"],
};
