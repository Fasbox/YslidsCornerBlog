import express from "express";
import cors from "cors";
import helmet from "helmet";
import type { CorsOptions } from "cors";

import { env } from "./config/env.js";
import { apiRateLimit, adminRateLimit } from "./middlewares/rateLimit.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { healthRouter } from "./routes/health.routes.js";
import { postsRouter } from "./routes/posts.routes.js";
import { adminPostsRouter } from "./routes/admin.posts.routes.js";
import { tagsRouter } from "./routes/tags.routes.js";
import { adminSeriesRouter } from "./routes/admin.series.routes.js";


const app = express();

// --- CORS (una sola vez, configuración única) ---
const allowedOrigins = env.corsOrigin
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests sin origin (curl, server-to-server) -> permitir
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS bloqueado para origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Preflight para cualquier ruta SIN wildcard problemático (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return cors(corsOptions)(req, res, next);
  }
  next();
});

// --- Seguridad mínima (antes de rutas) ---
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https:", "data:"],
        "frame-src": ["'self'", "https://www.youtube-nocookie.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // para imágenes externas
  })
);


// --- Rate limit (antes de rutas) ---
app.use("/admin", adminRateLimit);
app.use(apiRateLimit);


// --- Body parsing ---
app.use(express.json({ limit: "1mb" }));

// --- Routes ---
app.use(healthRouter);
app.use(postsRouter);
app.use(tagsRouter);
app.use(adminPostsRouter);
app.use(adminSeriesRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: { message: "Ruta no encontrada", code: "NOT_FOUND" } });
});

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[api] running on http://localhost:${env.port}`);
});
