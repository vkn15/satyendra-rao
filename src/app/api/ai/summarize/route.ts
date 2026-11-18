import { NextRequest, NextResponse } from 'next/server';
import { summarizeNewsArticle } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, source, description, publishedDate, sourceUrl } = body;

    if (!headline || !sourceUrl) {
      return NextResponse.json({ error: 'Headline and sourceUrl are required' }, { status: 400 });
    }

    const summary = await summarizeNewsArticle({
      headline,
      source: source || 'News Desk',
      description: description || headline,
      publishedDate,
      sourceUrl
    });

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error in AI summarize API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
