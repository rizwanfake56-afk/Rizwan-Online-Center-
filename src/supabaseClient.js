import { createClient } from '@supabase/supabase-js';

// These are injected automatically by the Bolt runtime as VITE_ env vars.
// Only the anon key (safe for the browser) is used here — never the service role key.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Format: ROC + 8 alphanumeric chars (uppercase, unambiguous — no 0/O/1/I)
// ~2.8 trillion possible values, making brute-force enumeration impractical.
const TRACKING_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateTrackingId() {
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += TRACKING_ALPHABET[Math.floor(Math.random() * TRACKING_ALPHABET.length)];
  }
  return 'ROC' + suffix;
}
