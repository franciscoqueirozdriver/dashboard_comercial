import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
