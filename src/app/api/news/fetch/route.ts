import { NextResponse } from 'next/server';
import { fetchAndSummarizeFeeds } from '@/lib/rss';

export async function POST() {
  try {
    const result = await fetchAndSummarizeFeeds();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching and summarizing feeds:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
