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
    if (pathname === '/signin') return NextResponse.next();
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }
  
  // if the user is not a doctor, redirect to the join page
  
  const { uid, customClaims } = await responseAPI.json();
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-user', `${uid}`);
  requestHeaders.set('x-claims', `${JSON.stringify(customClaims)}`);
  requestHeaders.set('x-origin', `${request.nextUrl.origin}`);

  if (!customClaims || !customClaims.isDoctor) {
    if (pathname === '/join') return NextResponse.next({
      headers: requestHeaders,
    });
    return NextResponse.redirect(new URL('/join', request.nextUrl), {
      headers: requestHeaders
    });
  } 
  
  if(customClaims.isDoctor && !pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl), {
      headers: requestHeaders
    });
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

