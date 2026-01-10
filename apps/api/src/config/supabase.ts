import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// OJO: este cliente BYPASSA RLS. Úsalo solo en rutas admin protegidas.
export const supabaseService = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});
