import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Clear the session cookie by setting it with an expired date
  const response = NextResponse.json({ message: 'Logged out' });
    // Cookie options
    const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, 
    path: '/',
    maxAge: 0 // expired age
  }
  // Set cookie to expire in the past (logout)
  response.cookies.set('session', '', COOKIE_OPTIONS);

  return response;
}