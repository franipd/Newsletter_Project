import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the secret key — bypasses RLS so the
 * publish pipeline can insert editions. Never import this from client code.
 * Env vars live only in Vercel project settings / .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    return null;
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false },
  });
}
