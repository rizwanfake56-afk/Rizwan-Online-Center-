import { createClient } from '@supabase/supabase-js';

// These are injected automatically by the Bolt runtime as VITE_ env vars.
// Only the anon key (safe for the browser) is used here — never the service role key.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Format: ROC + 7 digits, e.g. ROC1234567
export function generateTrackingId() {
  const n = Math.floor(1000000 + Math.random() * 9000000);
  return 'ROC' + n;
}
