import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "yslids-api", ts: new Date().toISOString() });
});
