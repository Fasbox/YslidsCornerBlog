// src/middlewares/requireAdmin.ts
import type { Context, Next } from "hono";
import type { AppContext } from "../types/app";
import { supabaseAnon } from "../config/supabase";
import { jsonError } from "../utils/errors";

export async function requireAdmin(c: Context<AppContext>, next: Next) {
  const auth = c.req.header("Authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return jsonError(c, "Falta Authorization Bearer token", "NO_TOKEN", 401);
  }

  const token = auth.slice("Bearer ".length).trim();
  if (!token) {
    return jsonError(c, "Token vacío", "EMPTY_TOKEN", 401);
  }

  const sb = supabaseAnon(c.env);
  const { data, error } = await sb.auth.getUser(token);

  if (error || !data?.user) {
    return jsonError(c, "JWT inválido o expirado", "INVALID_JWT", 401, error);
  }

  const role = (data.user.app_metadata as any)?.role;
  if (role !== "admin") {
    return jsonError(c, "No autorizado (no admin)", "NOT_ADMIN", 403);
  }

  // ✅ ya no da "never"
  c.set("user", data.user);

  await next();
}
