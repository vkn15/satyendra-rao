import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/storage';
import { requireAdmin } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export interface MovementEvent {
  id: string;
  title_en: string;
  title_hi: string;
  date: string;
  time: string;
  location: string;
  district: string;
  category: string;
  description_en: string;
  description_hi: string;
  rsvp_url?: string;
  status: 'upcoming' | 'live' | 'completed';
}

const defaultEvents: MovementEvent[] = [
  {
    id: 'evt-1',
    title_en: 'Rajasthan Youth Reform Townhall - Jaipur Conclave',
    title_hi: 'राजस्थान युवा सुधार टाउनहॉल - जयपुर महाधिवेशन',
    date: '2026-12-05',
    time: '11:00 AM',
    location: 'Maharana Pratap Auditorium, JLN Marg, Jaipur',
    district: 'Jaipur',
    category: 'Student Townhall',
    description_en: 'Comprehensive consultative dialogue on paper leak penalty statutes and transparent examination calendar mandates.',
    description_hi: 'पेपर लीक निवारण कानूनों एवं 90-दिवसीय पारदर्शी भर्ती कैलेंडर पर अभ्यर्थियों के साथ राज्यस्तरीय परिचर्चा।',
    rsvp_url: 'https://satyendrarao.in/volunteer',
    status: 'upcoming'
  },
  {
    id: 'evt-2',
    title_en: 'Statewide Candidate Rights & RTI Legal Workshop',
    title_hi: 'राज्यव्यापी अभ्यर्थी अधिकार एवं आरटीआई विधिक कार्यशाला',
    date: '2026-12-15',
    time: '02:00 PM',
    location: 'District Youth Center, Sikar Road, Sikar',
    district: 'Sikar',
    category: 'Legal Workshop',
    description_en: 'Practical legal orientation on filing answer key appeals, RTI tracking of vacant seats, and candidate rights.',
    description_hi: 'उत्तर कुंजी आपत्ति, रिक्त पदों की आरटीआई ट्रैकिंग एवं विधिक अधिकारों पर निःशुल्क प्रशिक्षण।',
    rsvp_url: 'https://satyendrarao.in/volunteer',
    status: 'upcoming'
  }
];

export async function GET() {
  try {
    const db = getDatabase();
    if (!db.events || db.events.length === 0) {
      db.events = defaultEvents;
      saveDatabase(db);
    }
    return NextResponse.json(db.events);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const db = getDatabase();
    if (!db.events) db.events = defaultEvents;

    const newEvent: MovementEvent = {
      id: `evt-${Date.now()}`,
      title_en: body.title_en || 'Youth Movement Event',
      title_hi: body.title_hi || 'युवा सुधार कार्यक्रम',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '10:00 AM',
      location: body.location || 'Jaipur',
      district: body.district || 'Jaipur',
      category: body.category || 'Townhall',
      description_en: body.description_en || '',
      description_hi: body.description_hi || '',
      rsvp_url: body.rsvp_url || '',
      status: body.status || 'upcoming'
    };

    db.events.unshift(newEvent);
    saveDatabase(db);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.events) db.events = defaultEvents;

    const idx = db.events.findIndex((e: any) => e.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    db.events[idx] = { ...db.events[idx], ...updates };
    saveDatabase(db);
    return NextResponse.json(db.events[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.events) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.events = db.events.filter((e: any) => e.id !== id);
    saveDatabase(db);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
