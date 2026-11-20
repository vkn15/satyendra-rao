import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSupabaseClient } from './serverSupabase';

export interface AdminAuthResult {
  authorized: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: string;
  status?: number;
}

/**
 * Verifies admin session token via Supabase Auth and validates that the
 * user possesses an authorized administrative role in public.admin_users.
 */
export async function verifyAdminSession(req?: NextRequest): Promise<AdminAuthResult> {
  try {
    const cookieStore = cookies();
    const token = req?.cookies.get('sr_admin_session')?.value || cookieStore.get('sr_admin_session')?.value;

    if (!token) {
      return { authorized: false, error: 'Unauthorized: No active admin session', status: 401 };
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return { authorized: false, error: 'Service Unavailable: Supabase is not configured on the server', status: 503 };
    }

    // 1. Verify access token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return { authorized: false, error: 'Unauthorized: Invalid or expired session', status: 401 };
    }

    // 2. Verify admin role in public.admin_users table
    const { data: adminRecord, error: roleError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', user.id)
      .single();

    if (roleError || !adminRecord) {
      return { authorized: false, error: 'Forbidden: User is not authorized in admin directory', status: 403 };
    }

    const allowedRoles = ['super_admin', 'admin', 'editor'];
    if (!allowedRoles.includes(adminRecord.role)) {
      return { authorized: false, error: 'Forbidden: Insufficient administrative privileges', status: 403 };
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email || adminRecord.email,
        role: adminRecord.role
      }
    };
  } catch (error: any) {
    return { authorized: false, error: error.message || 'Server authentication error', status: 500 };
  }
}

/**
 * Helper to guard mutating API routes. Returns null if authorized, or a NextResponse error to immediately return.
 */
export async function requireAdmin(req?: NextRequest): Promise<NextResponse | null> {
  const result = await verifyAdminSession(req);
  if (!result.authorized) {
    return NextResponse.json(
      { error: result.error || 'Unauthorized' },
      { status: result.status || 401 }
    );
  }
  return null;
}
