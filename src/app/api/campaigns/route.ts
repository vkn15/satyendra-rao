import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, updateCampaign } from '@/lib/db';

export async function GET() {
  try {
    const list = await getCampaigns();
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const updated = await updateCampaign(id, updates);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
