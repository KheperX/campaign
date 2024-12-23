import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
  // Handle CORS
  const res = NextResponse.next();
  const origin = req.headers.get('origin');
  
  if (origin === 'http://localhost:4000') {
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  // Handle authentication
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await verifyToken(token);
    return res;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/campaigns/:path*'],
}

