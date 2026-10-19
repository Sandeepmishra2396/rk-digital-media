import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Base Supabase client with anonymous public key
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Helper to create an authenticated client using the user's Bearer JWT
export function getAuthenticatedSupabaseClient(jwtToken) {
  if (!jwtToken) return supabase;
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
}
