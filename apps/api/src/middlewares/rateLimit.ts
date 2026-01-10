import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const apiRateLimit = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

export const adminRateLimit = rateLimit({
  windowMs: 60_000, // 1 min
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
