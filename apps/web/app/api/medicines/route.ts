import { readFileSync } from 'fs';
import {  NextResponse } from 'next/server';
import path from 'path';
import { URL } from "url";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q')
  
  if(query === null) 
    return NextResponse.json({ medicines: [] }, { status: 200 });


  const medicines = Array.from(ALPHABET).map(a=> {
    const filePath = path.join(process.cwd(), `/public/static/medicines/${a}.json`);
    return JSON.parse(readFileSync(filePath, 'utf-8')) as Array<{
      name: string
    }>;
  }).flat(1);

  const mostRelevantMatch = medicines
    .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
    .filter(med => med.name.toLowerCase().startsWith((query[0] || '').toLowerCase()));
  
  return NextResponse.json({  
    medicines: mostRelevantMatch.concat(medicines)
    .filter(med => med.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 50)
  }, { status: 200, headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800'
  } });
}

/* 
  Learn at:
    https://dev.to/geiel/how-to-use-firebase-authentication-in-nextjs-13-client-and-server-side-1bbn
    https://stackoverflow.com/questions/76879398/cant-middleware-send-json-to-page-components
*/
