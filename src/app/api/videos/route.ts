import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/storage';
import { YouTubeVideo } from '@/types';

export const dynamic = 'force-dynamic';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : clean;
}

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json(db.youtube_videos || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDatabase();

    const videoId = extractYouTubeId(body.video_id || body.url || body.youtube_url || '');
    if (!videoId) {
      return NextResponse.json({ error: 'Valid YouTube Video ID or URL is required' }, { status: 400 });
    }

    const newVideo: YouTubeVideo = {
      id: `yt-${Date.now()}`,
      video_id: videoId,
      title_en: body.title_en || 'Untitled Video',
      title_hi: body.title_hi || body.title_en || 'वीडियो',
      description_en: body.description_en || '',
      description_hi: body.description_hi || '',
      thumbnail_url: body.thumbnail_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80`,
      duration: body.duration || '15:00',
      views_count: parseInt(body.views_count) || 1000,
      published_date: body.published_date || new Date().toISOString(),
      category: body.category || 'Speeches'
    };

    if (!db.youtube_videos) db.youtube_videos = [];
    db.youtube_videos.unshift(newVideo);
    saveDatabase(db);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const index = db.youtube_videos?.findIndex(v => v.id === id);

    if (index === -1 || index === undefined) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (updates.video_id) {
      updates.video_id = extractYouTubeId(updates.video_id);
    }

    db.youtube_videos[index] = {
      ...db.youtube_videos[index],
      ...updates
    };

    saveDatabase(db);
    return NextResponse.json(db.youtube_videos[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    const initialLen = db.youtube_videos?.length || 0;
    db.youtube_videos = db.youtube_videos?.filter(v => v.id !== id) || [];

    if (db.youtube_videos.length === initialLen) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    saveDatabase(db);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
