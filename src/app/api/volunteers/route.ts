import { NextRequest, NextResponse } from 'next/server';
import { getVolunteers, createVolunteer, updateVolunteerStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const district = searchParams.get('district') || undefined;

    const list = await getVolunteers({ status, district });
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, phone, email, state, district } = body;

    if (!full_name || !phone || !email || !district) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 });
    }

    const volunteer = await createVolunteer(body);
    return NextResponse.json(volunteer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    const updated = await updateVolunteerStatus(id, status, notes);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
