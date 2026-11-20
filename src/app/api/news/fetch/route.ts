import { NextRequest, NextResponse } from 'next/server';
import { fetchAndSummarizeFeeds } from '@/lib/rss';
import { requireAdmin } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const result = await fetchAndSummarizeFeeds();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching and summarizing feeds:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
