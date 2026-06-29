// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/api/swarm/:path*',
};

export async function middleware(req: NextRequest) {
  // Bypassed Redis for local fast testing
  return NextResponse.next();
}
