import { NextRequest, NextResponse } from 'next/server';
import { translateContent } from '@/lib/ai';
import { requireAdmin } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const { text, from, to } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const translated = await translateContent({
      text,
      from: from || 'en',
      to: to || 'hi'
    });

    return NextResponse.json({ translated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
