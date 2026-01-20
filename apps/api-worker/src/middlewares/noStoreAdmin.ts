// src/middlewares/noStoreAdmin.ts
import type { MiddlewareHandler } from "hono";

export const noStoreAdmin: MiddlewareHandler = async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
};
