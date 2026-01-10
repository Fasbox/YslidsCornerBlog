import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";

  const fallback = { status: 500, message: "Error interno del servidor" };

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code ?? "HTTP_ERROR",
        details: isProd ? null : (err.details ?? null),
      },
    });
  }

  return res.status(fallback.status).json({
    error: {
      message: fallback.message,
      code: "INTERNAL_SERVER_ERROR",
      details: isProd ? null : String(err),
    },
  });
}
