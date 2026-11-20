import { NextRequest, NextResponse } from 'next/server';
import { translateContent } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
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
