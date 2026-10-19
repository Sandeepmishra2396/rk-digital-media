import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://yeytelvcphrsgzflskel.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlleXRlbHZjcGhyc2d6Zmxza2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDQxOTgsImV4cCI6MjEwNzkyMDE5OH0.WPnpiqSTVG4F6FU__j51YsfPECg1IV3QjygNT0TseA0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
