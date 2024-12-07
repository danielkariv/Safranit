import { NextRequest, NextResponse } from 'next/server';
import { verifySession , updateUserBooksStatus} from '@/libs/data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    // Authenticate the user using cookies
    const sessionCookie = req.cookies.get('session')?.value;
    const sessionData = (sessionCookie)? await verifySession(sessionCookie) : null;
    
    if (!sessionCookie || !sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const status = "ignore";
    // Update the wishlist
    await updateUserBooksStatus(sessionData, productId, status);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update unmark book.' }, { status: 500 });
  }
}
