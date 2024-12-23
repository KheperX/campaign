import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const { user } = await loginUser({ email, password });

    // The access token is now set as an HTTP-only cookie by loginUser
    // We just need to return the user data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
    }
  }
}

