import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = (searchParams.get('range') || '30d') as any;
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;

    const stats = await getAnalyticsStats({ range, from, to });
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
