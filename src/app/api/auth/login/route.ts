import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getServerSupabaseClient } from '@/lib/serverSupabase';

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

    // 2. Authenticate strictly with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (authError || !authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // 3. Verify server-side authorization in public.admin_users
    const serverSupabase = getServerSupabaseClient() || supabase;
    const { data: adminRecord, error: adminQueryError } = await serverSupabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', authData.user.id)
      .single();

    if (adminQueryError || !adminRecord) {
      // User authenticated in auth.users, but is not in the admin_users table
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Access denied. Your account is not registered as an authorized administrator.' },
        { status: 403 }
      );
    }

    const allowedRoles = ['super_admin', 'admin', 'editor'];
    if (!allowedRoles.includes(adminRecord.role)) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Access denied. Insufficient administrative privileges.' },
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
        role: adminRecord.role
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
