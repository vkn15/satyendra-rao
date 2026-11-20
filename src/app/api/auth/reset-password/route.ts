import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://satyendra-rao.vercel.app';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${siteUrl}/admin/login?reset=true`
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to your email.'
      });
    }

    // Supabase not configured in local environment
    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been triggered. For local development, update the ADMIN_PASSWORD environment variable in .env.local.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
