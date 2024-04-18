import { auth } from 'firebase-admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initAdminSDK } from '../../../lib/firebase/admin-sdk';

initAdminSDK();
export async function GET() {
  const session = cookies().get('session')?.value || '';
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  const decodedClaims = await auth().verifySessionCookie(session, true);
  if (!decodedClaims) return NextResponse.json({ user: null }, { status: 401 });
  const { customClaims } = await auth().getUser(decodedClaims.uid);
  return NextResponse.json({ uid: decodedClaims.uid, customClaims }, { status: 200 });
}

/* 
  Learn at:
    https://dev.to/geiel/how-to-use-firebase-authentication-in-nextjs-13-client-and-server-side-1bbn
    https://stackoverflow.com/questions/76879398/cant-middleware-send-json-to-page-components
*/
