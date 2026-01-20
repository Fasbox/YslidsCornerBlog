// src/utils/errors.ts
import type { Context } from "hono";

export type ApiErrorPayload = {
  error: { message: string; code: string; details: any | null };
};

export function jsonError(
  c: Context,
  message: string,
  code = "ERROR",
  status = 400,
  details: any = null
) {
  return c.json<ApiErrorPayload>({ error: { message, code, details } }, status as any);
}

export function toErrorResponse(c: Context, e: any) {
  // Si ya es Response, devuélvelo (por si algún middleware lo devuelve)
  if (e instanceof Response) return e;

  const status =
    typeof e?.status === "number" ? e.status :
    typeof e?.statusCode === "number" ? e.statusCode :
    500;

  const code =
    typeof e?.code === "string" && e.code ? e.code : "ERROR";

  const message =
    typeof e?.message === "string" && e.message.trim()
      ? e.message
      : typeof e === "string"
        ? e
        : "Error interno del servidor";

  const details = e?.details ?? null;

  return jsonError(c, message, code, status, details);
}
