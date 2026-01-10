import "dotenv/config";

const get = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${key}`);
  return v;
};

export const env = {
  nodeEnv: get("NODE_ENV", "development"),
  port: Number(get("PORT", "4000")),
  corsOrigin: get("CORS_ORIGIN", "http://localhost:5173"),
  rateLimitWindowMs: Number(get("RATE_LIMIT_WINDOW_MS", "60000")),
  rateLimitMax: Number(get("RATE_LIMIT_MAX", "120")),

  supabaseUrl: get("SUPABASE_URL"),
  supabaseAnonKey: get("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: get("SUPABASE_SERVICE_ROLE_KEY"),
};

