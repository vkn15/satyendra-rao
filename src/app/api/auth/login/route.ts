import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isDesignatedAdmin } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Verify Supabase configuration
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { 
          error: 'Supabase authentication service is not configured on the server. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.' 
        },
        { status: 503 }
      );
    }

    // 2. Authenticate strictly with Supabase Auth (email/password)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (authError || !authData.user || !authData.session) {
      return NextResponse.json(
        { error: authError?.message || 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // 3. Verify server-side that the authenticated user matches the designated administrator
    const designatedAdminId = (process.env.ADMIN_USER_ID || '').trim();
    const designatedAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    if (!designatedAdminId && !designatedAdminEmail) {
      console.error('[Admin Auth] ADMIN_USER_ID environment variable is missing on the server.');
      await supabase.auth.signOut();
      return NextResponse.json(
        { 
          error: 'Server configuration error: ADMIN_USER_ID environment variable is not configured on Vercel.',
          authUserId: authData.user.id
        },
        { status: 500 }
      );
    }

    if (!isDesignatedAdmin(authData.user)) {
      console.warn('[Admin Auth] Access denied: User is authenticated in Supabase Auth but does not match ADMIN_USER_ID.', {
        authUserId: authData.user.id,
        authUserEmail: authData.user.email
      });
      await supabase.auth.signOut();
      return NextResponse.json(
        { 
          error: 'Access denied. Your account is not authorized as the administrator.',
          authUserId: authData.user.id
        },
        { status: 403 }
      );
    }

    // 4. Set secure persistent session cookie with Supabase JWT access token
    const maxAgeSeconds = rememberMe !== false ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day
    const cookieStore = cookies();
    cookieStore.set('sr_admin_session', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds
    });

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'super_admin'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
