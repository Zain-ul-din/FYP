import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return NextResponse.next();

  const session = request.cookies.get('session');

  if (session === undefined) {
    if (pathname === '/signin') return NextResponse.next();
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }

  // verifies the session token using the Firebase Admin SDK

  const responseAPI = await fetch(`${request.nextUrl.origin}/api/signin`, {
    headers: { cookie: `session=${session?.value}` },
  });

  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }

  // if the user is not a doctor, redirect to the join page

  const { customClaims } = await responseAPI.json();

  if (!customClaims.isDoctor) {
    if (pathname === '/join') return NextResponse.next();
    return NextResponse.redirect(new URL('/join', request.nextUrl));
  }

  return NextResponse.next();
}
