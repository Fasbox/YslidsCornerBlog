// src/index.ts
import { Hono } from "hono";
import { corsHeaders, parseAllowedOrigins } from "./middlewares/cors";

import { healthRouter } from "./routes/health.routes";
import { tagsRouter } from "./routes/tags.routes";
import { postsRouter } from "./routes/posts.routes";
import { adminPostsRouter } from "./routes/admin.posts.routes";
import { adminSeriesRouter } from "./routes/admin.series.routes";
import { jsonError } from "./utils/errors";
import type { AppContext } from "./types/app";
import { securityHeaders } from "./middlewares/securityHeaders";
import { noStoreAdmin } from "./middlewares/noStoreAdmin";
import { adminTagsRouter } from "./routes/admin.tags.routes";

const app = new Hono<AppContext>();

/* -------------------- CORS -------------------- */

// Preflight
app.options("*", (c) => {
  const origin = c.req.header("Origin") ?? null;
  const allowed = parseAllowedOrigins(c.env.CORS_ORIGIN);
  const ch = corsHeaders(origin, allowed);
  if (!ch) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: ch });
});

// CORS en todas las respuestas (post-handler)
app.use("*", async (c, next) => {
  await next();

  const origin = c.req.header("Origin") ?? null;
  const allowed = parseAllowedOrigins(c.env.CORS_ORIGIN);
  const ch = corsHeaders(origin, allowed);

  if (ch) {
    for (const [k, v] of Object.entries(ch)) c.header(k, v);
  }
});

app.use("*", securityHeaders);
// Solo admin: no cache
app.use("/admin/*", noStoreAdmin);

/* -------------------- ROUTES -------------------- */

app.route("/", healthRouter);
app.route("/", tagsRouter);
app.route("/", postsRouter);
app.route("/", adminTagsRouter);
app.route("/", adminPostsRouter);
app.route("/", adminSeriesRouter);

/* -------------------- ERRORS -------------------- */

// Errores no controlados (muy recomendado)
app.onError((err, c) => {
  // En prod, evita filtrar internals (stack) — acá te devuelvo err como string simple.
  return jsonError(c, "Error interno del servidor", "INTERNAL_SERVER_ERROR", 500, String(err));
});

// 404 estándar
app.notFound((c) => jsonError(c, "Ruta no encontrada", "NOT_FOUND", 404));

export default app;
