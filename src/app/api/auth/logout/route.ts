import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    cookieStore.delete('sr_admin_session');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Silently continue
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error logging out' },
      { status: 500 }
    );
  }
}
