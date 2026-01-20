// src/middlewares/securityHeaders.ts
import type { MiddlewareHandler } from "hono";

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "no-referrer");
  c.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

// CSP básico (puedes endurecer después)
  c.header(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' https: data:",
      "script-src 'self' 'unsafe-inline' https:", // en Vite a veces necesitas unsafe-inline
      "style-src 'self' 'unsafe-inline' https:",
      "connect-src 'self' https:", // supabase + api
      "frame-ancestors 'none'",
    ].join("; ")
  );
};
