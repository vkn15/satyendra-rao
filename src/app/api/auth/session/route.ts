import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const result = await verifyAdminSession(req);

    if (!result.authorized || !result.user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: result.user
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
