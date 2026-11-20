import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Service role key is STRICTLY server-side only (never exposed with NEXT_PUBLIC_)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl && 
  (supabaseServiceRoleKey || supabaseAnonKey) && 
  !supabaseUrl.includes('your-supabase-url') &&
  supabaseUrl.startsWith('https://')
);

// Returns server-side Supabase client with service role key if available, or anon key
export function getServerSupabaseClient() {
  if (!isServerSupabaseConfigured) return null;
  const keyToUse = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, keyToUse, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Returns authenticated client for a specific user token
export function getUserSupabaseClient(token: string) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
