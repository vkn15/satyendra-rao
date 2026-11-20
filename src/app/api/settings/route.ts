import { NextRequest, NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings } from '@/lib/db';
import { verifyAdminSession, requireAdmin } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = await getAppSettings();
    const auth = await verifyAdminSession(req);

    // If caller is an authorized admin, provide masked keys for dashboard settings UI
    if (auth.authorized) {
      const safeSettings = {
        ...settings,
        gemini_api_key: settings.gemini_api_key ? '••••••••' + settings.gemini_api_key.slice(-4) : '',
        openai_api_key: settings.openai_api_key ? '••••••••' + settings.openai_api_key.slice(-4) : '',
        has_gemini_key: Boolean(settings.gemini_api_key),
        has_openai_key: Boolean(settings.openai_api_key)
      };
      return NextResponse.json(safeSettings);
    }

    // Public callers only receive public website configurations with all secret fields scrubbed
    const publicSettings = { ...settings };
    delete (publicSettings as any).gemini_api_key;
    delete (publicSettings as any).openai_api_key;
    delete (publicSettings as any).has_gemini_key;
    delete (publicSettings as any).has_openai_key;

    return NextResponse.json(publicSettings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

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
