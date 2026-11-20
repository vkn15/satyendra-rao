import { createClient } from '@supabase/supabase-js';

export function getSupabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();

  const isValidUrl = Boolean(url && url.startsWith('https://') && !url.includes('your-supabase-url'));
  const isConfigured = Boolean(isValidUrl && (serviceRoleKey || anonKey));

  return {
    url,
    anonKey,
    serviceRoleKey,
    isValidUrl,
    isConfigured,
    hasServiceRoleKey: Boolean(serviceRoleKey)
  };
}

export const isServerSupabaseConfigured = getSupabaseEnv().isConfigured;

// Returns server-side Supabase client with service role key if available, or anon key
export function getServerSupabaseClient() {
  const { url, anonKey, serviceRoleKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured) return null;
  const keyToUse = serviceRoleKey || anonKey;
  return createClient(url, keyToUse, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Returns authenticated client for a specific user token
export function getUserSupabaseClient(token: string) {
  const { url, anonKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured || !token) return null;
  const cleanToken = token.trim();
  return createClient(url, anonKey, {
    global: {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${cleanToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
