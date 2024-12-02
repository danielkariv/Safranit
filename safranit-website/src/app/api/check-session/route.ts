import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
  loggedIn: boolean;
}

export async function GET(req: NextRequest): Promise<NextResponse<ResponseData>> {
    const sessionCookie = req.cookies.get('session');
    
    if (sessionCookie) {
      // If session cookie exists, the user is logged in
      return NextResponse.json({ loggedIn: true });
    } else {
      // If no session cookie, the user is not logged in
      return NextResponse.json({ loggedIn: false });
    }
}
