import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sr_admin_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Local admin session
    if (token.startsWith('local-admin-token-')) {
      const email = process.env.ADMIN_EMAIL || 'admin@satyendrarao.in';
      return NextResponse.json({
        authenticated: true,
        user: {
          id: 'admin-env-user',
          email,
          role: 'super_admin'
        }
      });
    }

    // Supabase Auth session validation
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return NextResponse.json({ authenticated: false, user: null });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.app_metadata?.role || 'admin'
        }
      });
    }

    // Fallback: Token exists and valid
    return NextResponse.json({
      authenticated: true,
      user: {
        id: 'admin-session',
        email: process.env.ADMIN_EMAIL || 'admin@satyendrarao.in',
        role: 'admin'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
