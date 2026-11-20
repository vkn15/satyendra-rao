import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export interface GalleryPhoto {
  id: string;
  title_en: string;
  title_hi: string;
  image_url: string;
  category: string;
  date: string;
  caption_en?: string;
  caption_hi?: string;
  is_featured: boolean;
}

const defaultPhotos: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title_en: 'Ajmer to Jaipur 135 km Padyatra',
    title_hi: 'अजमेर से जयपुर 135 किमी पदयात्रा',
    image_url: '/images/satyendra_hero.png',
    category: 'Padyatra',
    date: '2023-10-15',
    caption_en: 'Satyendra Rao leading 10,000+ youth across National Highway demanding 90-day recruitment schedule.',
    caption_hi: '10,000 युवाओं के साथ 90-दिवसीय भर्ती कैलेंडर की मांग को लेकर पदयात्रा।',
    is_featured: true
  },
  {
    id: 'gal-2',
    title_en: 'Jaipur Youth Maha-Panchayat Conclave',
    title_hi: 'जयपुर युवा महापंचायत सम्मेलन',
    image_url: '/images/satyendra_about_bw.jpg',
    category: 'Conclave',
    date: '2024-09-20',
    caption_en: 'Addressing 50,000 students on judicial appeals against exam irregularities.',
    caption_hi: 'अभ्यर्थियों को संबोधित करते हुए सत्येंद्र राव।',
    is_featured: true
  },
  {
    id: 'gal-3',
    title_en: 'Press Conference at Pink City Press Club',
    title_hi: 'पिंक सिटी प्रेस क्लब में प्रेस वार्ता',
    image_url: '/images/satyendra_rao_new.jpg',
    category: 'Press Conference',
    date: '2025-03-12',
    caption_en: 'Release of the 10-Point Statutory Youth Reform Charter.',
    caption_hi: '10-सूत्रीय युवा सुधार चार्टर का विमोचन।',
    is_featured: true
  }
];

export async function GET() {
  try {
    const db = getDatabase();
    if (!db.gallery || db.gallery.length === 0) {
      db.gallery = defaultPhotos;
      saveDatabase(db);
    }
    return NextResponse.json(db.gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    if (!db.gallery) db.gallery = defaultPhotos;

    const newPhoto: GalleryPhoto = {
      id: `gal-${Date.now()}`,
      title_en: body.title_en || 'Movement Photograph',
      title_hi: body.title_hi || 'आंदोलन छायाचित्र',
      image_url: body.image_url || '/images/satyendra_about_bw.jpg',
      category: body.category || 'Movement',
      date: body.date || new Date().toISOString().split('T')[0],
      caption_en: body.caption_en || '',
      caption_hi: body.caption_hi || '',
      is_featured: body.is_featured ?? true
    };

    db.gallery.unshift(newPhoto);
    saveDatabase(db);
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.gallery) db.gallery = defaultPhotos;

    const idx = db.gallery.findIndex((g: any) => g.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });

    db.gallery[idx] = { ...db.gallery[idx], ...updates };
    saveDatabase(db);
    return NextResponse.json(db.gallery[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.gallery = db.gallery.filter((g: any) => g.id !== id);
    saveDatabase(db);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
