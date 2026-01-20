import { Hono } from "hono";
import type { AppContext } from "../types/app";

export const healthRouter = new Hono<AppContext>();

healthRouter.get("/health", (c) => {
  return c.json({ ok: true, service: "yslids-api", ts: new Date().toISOString() });
});
