import { existsSync, readFileSync } from 'fs';
import {  NextResponse } from 'next/server';
import path from 'path';
import { URL } from "url";

export async function GET(req: Request) {
  console.log(req.url)
  const url = new URL(req.url);
  const city = url.searchParams.get('city')
  if(city === null) 
    return NextResponse.json({ hospitals: [] }, { status: 200 });
  
  const cwd = process.cwd();
  const filePath = path.join(cwd, `/public/static/hospitals/${city}.json`);

  if(!existsSync(filePath))  
    return NextResponse.json({ hospitals: [] }, { status: 200 });

  
  return NextResponse.json({  
    hospitals: JSON.parse(readFileSync(filePath, 'utf-8'))
  }, { status: 200, headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800'
  } });
}

/* 
  Learn at:
    https://dev.to/geiel/how-to-use-firebase-authentication-in-nextjs-13-client-and-server-side-1bbn
    https://stackoverflow.com/questions/76879398/cant-middleware-send-json-to-page-components
*/
