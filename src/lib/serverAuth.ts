import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSupabaseClient } from './serverSupabase';

export const dynamic = 'force-dynamic';

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
 * Validates whether the authenticated Supabase user matches the designated single administrator.
 * Matches against ADMIN_USER_ID environment variable (and optionally ADMIN_EMAIL).
 */
export function isDesignatedAdmin(user: { id: string; email?: string }): boolean {
  const adminUserId = (process.env.ADMIN_USER_ID || '').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  // Primary check: match server-side designated UUID from environment variables
  if (adminUserId && user.id === adminUserId) {
    return true;
  }

  // Supporting check: match server-side designated email
  if (adminEmail && user.email && user.email.trim().toLowerCase() === adminEmail) {
    return true;
  }

  return false;
}

/**
 * Verifies admin session token via Supabase Auth and validates that the
 * user possesses the designated administrator ID.
 */
export async function verifyAdminSession(req?: NextRequest): Promise<AdminAuthResult> {
  try {
    const cookieStore = cookies();
    const token = req?.cookies.get('sr_admin_session')?.value || cookieStore.get('sr_admin_session')?.value;

    if (!token) {
      return { authorized: false, error: 'Unauthorized: No active admin session', status: 401 };
    }

    const baseSupabase = getServerSupabaseClient();
    if (!baseSupabase) {
      return { authorized: false, error: 'Service Unavailable: Supabase is not configured on the server', status: 503 };
    }

    // 1. Verify access token with Supabase Auth
    const { data: { user }, error: authError } = await baseSupabase.auth.getUser(token);
    if (authError || !user) {
      return { authorized: false, error: 'Unauthorized: Invalid or expired session', status: 401 };
    }

    // 2. Verify that the authenticated user matches the designated single administrator
    if (!isDesignatedAdmin(user)) {
      console.warn('[Admin Auth] Session rejected: User ID does not match designated admin ID.', {
        userId: user.id
      });
      return { authorized: false, error: 'Forbidden: Account is not authorized as administrator', status: 403 };
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email || '',
        role: 'super_admin'
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
