import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value || '';
  
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // If there's an error verifying the session cookie, clear the session cookie
  cookieStore.set('session', '', { maxAge: -1, path: '/' });
  return NextResponse.json({ user: null }, { status: 401 });
}

