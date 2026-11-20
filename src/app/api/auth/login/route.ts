import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Authenticate with Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error || !data.user || !data.session) {
        return NextResponse.json(
          { error: error?.message || 'Invalid email or password. Please check your credentials.' },
          { status: 401 }
        );
      }

      // Check if user is an authorized admin in public.admin_users (if table exists)
      try {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (adminRecord && adminRecord.role) {
          data.user.app_metadata.role = adminRecord.role;
        }
      } catch (e) {
        // Table may not be seeded yet; authenticated Supabase user proceeds
      }

      const cookieStore = cookies();
      cookieStore.set('sr_admin_session', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days persistent session
      });

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.app_metadata?.role || 'admin'
        }
      });
    }

    // 2. Handle environment-defined admin for initial setup/testing
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@satyendrarao.in').toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'Satyendra@2026';

    if (email.toLowerCase().trim() === envAdminEmail) {
      if (password === envAdminPassword) {
        const cookieStore = cookies();
        cookieStore.set('sr_admin_session', `local-admin-token-${Date.now()}`, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.json({
          success: true,
          user: {
            id: 'admin-env-user',
            email: envAdminEmail,
            role: 'super_admin'
          },
          notice: 'Authenticated as Administrator.'
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      error: 'Invalid email or password. Please verify your credentials or configure Supabase Auth.'
    }, { status: 401 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal authentication error' }, { status: 500 });
  }
}
