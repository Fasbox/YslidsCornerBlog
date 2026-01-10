import type { Request, Response, NextFunction } from "express";
import { supabaseAnon } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(401, "Falta Authorization Bearer token", { code: "NO_TOKEN" });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) throw new HttpError(401, "Token vacío", { code: "EMPTY_TOKEN" });

    const { data, error } = await supabaseAnon.auth.getUser(token);
    if (error || !data?.user) {
      throw new HttpError(401, "JWT inválido o expirado", { code: "INVALID_JWT", details: error });
    }

    const role = (data.user.app_metadata as any)?.role;
    if (role !== "admin") {
      throw new HttpError(403, "No autorizado (no admin)", { code: "NOT_ADMIN" });
    }

    // adjuntamos usuario por si luego lo necesitamos
    (req as any).user = data.user;

    next();
  } catch (e) {
    next(e);
  }
}
