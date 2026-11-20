import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export interface AchievementItem {
  id: string;
  year: string;
  title_en: string;
  title_hi: string;
  impact_metric_en: string;
  impact_metric_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  is_featured?: boolean;
}

const defaultAchievements: AchievementItem[] = [
  {
    id: 'ach-1',
    year: '2021 - 2022',
    title_en: 'Grassroots Aspirant Dialogues & First Satyagraha',
    title_hi: 'ग्रामीण छात्र संवाद एवं प्रथम सत्याग्रह',
    impact_metric_en: '10,000+ Aspirants Consulted',
    impact_metric_hi: '10,000+ प्रतियोगी छात्रों से प्रत्यक्ष संवाद',
    description_en: 'Direct dialogue with competitive students in Sikar, Kota, and Jaipur hostels, formalizing the first statewide anti-leak charter.',
    description_hi: 'सीकर, कोटा और जयपुर के कोचिंग हॉस्टलों में रहकर 10,000+ प्रतियोगी छात्रों से प्रत्यक्ष संवाद। पेपर लीक के विरुद्ध राज्यव्यापी मांग पत्र तैयार किया गया।',
    category: 'Ground Movement',
    is_featured: true
  },
  {
    id: 'ach-2',
    year: '2023',
    title_en: '135 km Historic Foot March (Ajmer to Jaipur)',
    title_hi: 'अजमेर से जयपुर 135 किमी विशाल पदयात्रा',
    impact_metric_en: '135 km Covered • 10,000 Youth',
    impact_metric_hi: '135 किमी पदयात्रा • 10,000 युवा',
    description_en: 'A historic peaceful padyatra mobilizing youth from RPSC headquarters in Ajmer to the state capital Jaipur demanding 90-day recruitment schedules.',
    description_hi: 'आरपीएससी में पारदर्शिता और 90 दिवसीय भर्ती समय-सीमा की मांग को लेकर 10,000 युवाओं के साथ ऐतिहासिक शांतिपूर्ण पदयात्रा।',
    category: 'Padyatra',
    is_featured: true
  },
  {
    id: 'ach-3',
    year: '2024 - 2025',
    title_en: 'Jaipur Youth Maha-Panchayat: 50,000 Strong Conclave',
    title_hi: 'जयपुर युवा महापंचायत: 50,000 अभ्यर्थियों का ऐतिहासिक जमावड़ा',
    impact_metric_en: '50,000+ Conclave in Jaipur',
    impact_metric_hi: '50,000+ अभ्यर्थियों का विशाल सम्मेलन',
    description_en: 'Historic gathering of students in Jaipur demanding transparent investigations into recruitment anomalies and biometric center vetting.',
    description_hi: 'एसआई भर्ती एवं शिक्षक भर्ती में धांधली की निष्पक्ष जांच और पारदर्शी पुनः परीक्षा हेतु ऐतिहासिक जनसमर्थन।',
    category: 'Maha-Panchayat',
    is_featured: true
  },
  {
    id: 'ach-4',
    year: '2026',
    title_en: 'Statutory 10-Point Youth Reform Charter',
    title_hi: '10-सूत्रीय "युवा सुधार चार्टर" का वैधानिक प्रारूप',
    impact_metric_en: '33 Districts Policy Presentation',
    impact_metric_hi: '33 जिलों हेतु वैधानिक सुधार',
    description_en: 'Presented to state administration: district-level centers, candidate exam insurance, biometric vetting, and an independent Youth Lokpal.',
    description_hi: 'मुख्य शासन सचिवालय में प्रस्तुत: परीक्षा केंद्रों का जिला स्तर आवंटन, परीक्षा बीमा, बायोमेट्रिक सुरक्षा और स्वतंत्र युवा लोकपाल।',
    category: 'Policy Landmark',
    is_featured: true
  }
];

export async function GET() {
  try {
    const db = getDatabase();
    if (!db.achievements || db.achievements.length === 0) {
      db.achievements = defaultAchievements;
      saveDatabase(db);
    }
    return NextResponse.json(db.achievements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();
    if (!db.achievements) db.achievements = defaultAchievements;

    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      year: body.year || '2026',
      title_en: body.title_en || '',
      title_hi: body.title_hi || '',
      impact_metric_en: body.impact_metric_en || '',
      impact_metric_hi: body.impact_metric_hi || '',
      description_en: body.description_en || '',
      description_hi: body.description_hi || '',
      category: body.category || 'Milestone',
      is_featured: body.is_featured ?? true
    };

    db.achievements.unshift(newItem);
    saveDatabase(db);
    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.achievements) db.achievements = defaultAchievements;

    const idx = db.achievements.findIndex((a: any) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    db.achievements[idx] = { ...db.achievements[idx], ...updates };
    saveDatabase(db);
    return NextResponse.json(db.achievements[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDatabase();
    if (!db.achievements) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.achievements = db.achievements.filter((a: any) => a.id !== id);
    saveDatabase(db);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
