import { NextRequest, NextResponse } from 'next/server';
import { generateSocialMediaCaptions, suggestBlogTopics } from '@/lib/ai';
import { requireAdmin } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const { action, headline, summary, sourceUrl } = body;

    if (action === 'social_captions') {
      const captions = await generateSocialMediaCaptions({
        headline,
        summary,
        sourceUrl: sourceUrl || 'https://satyendrarao.in/news'
      });
      return NextResponse.json(captions);
    }

    if (action === 'blog_topics') {
      const topics = await suggestBlogTopics({
        newsHeadline: headline,
        summary
      });
      return NextResponse.json(topics);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in AI Assistant API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
