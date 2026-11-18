import { NextRequest, NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getAppSettings();
    // Mask sensitive keys for client
    const safeSettings = {
      ...settings,
      gemini_api_key: settings.gemini_api_key ? '••••••••' + settings.gemini_api_key.slice(-4) : '',
      openai_api_key: settings.openai_api_key ? '••••••••' + settings.openai_api_key.slice(-4) : '',
      has_gemini_key: Boolean(settings.gemini_api_key),
      has_openai_key: Boolean(settings.openai_api_key)
    };
    return NextResponse.json(safeSettings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    // Only update key if actually changed (not masked)
    if (body.gemini_api_key && body.gemini_api_key.startsWith('••••')) {
      delete body.gemini_api_key;
    }
    if (body.openai_api_key && body.openai_api_key.startsWith('••••')) {
      delete body.openai_api_key;
    }

    const updated = await updateAppSettings(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
