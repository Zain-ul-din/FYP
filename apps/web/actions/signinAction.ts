'use server';
import { auth } from 'firebase-admin';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export default async function SignInAction(tokenId: string) {
  const decodeToken = await auth().verifyIdToken(tokenId);

  if (!decodeToken) return NextResponse.json('Auth failed', { status: 401 });

  const $1HOUR = 1 * 60 * 60 * 1000;
  const expiresIn = 48 * $1HOUR; // after 48 hours
  const sessionCookie = await auth().createSessionCookie(tokenId, {
    expiresIn,
  });

  cookies().set({
    name: 'session',
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    maxAge: expiresIn,
  });

  redirect('/dashboard');
}
