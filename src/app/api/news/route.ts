import { NextRequest, NextResponse } from 'next/server';
import { getNewsBriefs, createNewsBrief, updateNewsBrief, incrementNewsViews, deleteNewsBrief } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const importance = searchParams.get('importance') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const list = await getNewsBriefs({ status, importance, category, search, limit });
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'increment_view' && body.id) {
      await incrementNewsViews(body.id);
      return NextResponse.json({ ok: true });
    }

    const created = await createNewsBrief(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'News ID required' }, { status: 400 });

    const updated = await updateNewsBrief(id, updates);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'News ID required' }, { status: 400 });

    const deleted = await deleteNewsBrief(id);
    if (!deleted) return NextResponse.json({ error: 'News item not found' }, { status: 404 });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
