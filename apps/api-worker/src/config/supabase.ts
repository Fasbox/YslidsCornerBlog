// src/config/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CORS_ORIGIN: string; // CSV
};

export function supabaseAnon(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function supabaseService(env: Env): SupabaseClient {
  // BYPASS RLS -> solo admin + requireAdmin
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
