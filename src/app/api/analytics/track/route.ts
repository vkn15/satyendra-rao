import { NextRequest, NextResponse } from 'next/server';
import { logPageView, logAnalyticsEvent } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === 'page_view') {
      await logPageView({
        path: body.path || '/',
        title: body.title,
        visitor_id: body.visitor_id || 'anonymous',
        session_id: body.session_id || 'session',
        referrer: body.referrer,
        user_agent: req.headers.get('user-agent') || undefined,
        device_type: body.device_type || 'desktop',
        language: body.language || 'hi'
      });
      return NextResponse.json({ ok: true });
    }

    if (body.type === 'event') {
      await logAnalyticsEvent({
        event_type: body.event_type || 'custom',
        path: body.path || '/',
        visitor_id: body.visitor_id || 'anonymous',
        metadata: body.metadata || {}
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid payload type' }, { status: 400 });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
