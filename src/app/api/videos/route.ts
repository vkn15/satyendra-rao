import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/storage';
import { YouTubeVideo } from '@/types';
import { requireAdmin } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : clean;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';
    const publishedOnly = searchParams.get('published') === 'true';

    const db = getDatabase();
    let videos: YouTubeVideo[] = db.youtube_videos || [];

    if (publishedOnly) {
      videos = videos.filter(v => v.is_published !== false);
    }

    if (featuredOnly) {
      videos = videos.filter(v => v.is_featured === true);
    }

    if (category && category !== 'All') {
      videos = videos.filter(v => v.category?.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const body = await req.json();
    const db = getDatabase();

    const videoId = extractYouTubeId(body.video_id || body.url || body.youtube_url || '');
    if (!videoId) {
      return NextResponse.json({ error: 'Valid YouTube Video ID or URL is required' }, { status: 400 });
    }

    const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const newVideo: YouTubeVideo = {
      id: `yt-${Date.now()}`,
      video_id: videoId,
      title_en: body.title_en || 'Untitled Video',
      title_hi: body.title_hi || body.title_en || 'वीडियो',
      description_en: body.description_en || '',
      description_hi: body.description_hi || '',
      thumbnail_url: body.thumbnail_url || defaultThumbnail,
      duration: body.duration || '15:00',
      views_count: parseInt(body.views_count) || 5000,
      published_date: body.published_date || new Date().toISOString(),
      category: body.category || 'Speeches',
      is_featured: body.is_featured ?? false,
      is_published: body.is_published ?? true
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
    const authError = await requireAdmin(req);
    if (authError) return authError;

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
      if (!updates.thumbnail_url) {
        updates.thumbnail_url = `https://img.youtube.com/vi/${updates.video_id}/hqdefault.jpg`;
      }
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
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const db = getDatabase();
    if (!db.youtube_videos) {
      return NextResponse.json({ error: 'No videos found' }, { status: 404 });
    }

    db.youtube_videos = db.youtube_videos.filter(v => v.id !== id);
    saveDatabase(db);

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
