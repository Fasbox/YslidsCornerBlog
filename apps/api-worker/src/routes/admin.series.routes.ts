// src/routes/admin.series.routes.ts
import { Hono } from "hono";
import { z } from "zod";
import { jsonError, toErrorResponse } from "../utils/errors";
import { requireAdmin } from "../middlewares/requireAdmin";
import type { AppContext } from "../types/app";
import * as adminSeriesService from "../services/adminSeries.service";

export const adminSeriesRouter = new Hono<AppContext>();

adminSeriesRouter.use("/admin/*", requireAdmin);

const listSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
});

adminSeriesRouter.get("/admin/series", async (c) => {
  try {
    const parsed = listSchema.safeParse(c.req.query());
    if (!parsed.success) {
      return jsonError(c, "Query inválida", "BAD_QUERY", 400, parsed.error.flatten());
    }

    const result = await adminSeriesService.listSeries(c.env, parsed.data.section);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

const createSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional().nullable(),
});

adminSeriesRouter.post("/admin/series", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const created = await adminSeriesService.createSeries(c.env, parsed.data);
    return c.json(created, 201);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

// GET serie actual del post (0..1)
adminSeriesRouter.get("/admin/posts/:id/series", async (c) => {
  try {
    const postIdParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!postIdParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, postIdParsed.error.flatten());
    }

    const result = await adminSeriesService.getPostSeries(c.env, postIdParsed.data);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

const setPostSeriesSchema = z.object({
  series_id: z.string().uuid().nullable(),
});

// PUT asigna serie o null
adminSeriesRouter.put("/admin/posts/:id/series", async (c) => {
  try {
    const postIdParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!postIdParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, postIdParsed.error.flatten());
    }

    const body = await c.req.json().catch(() => ({}));
    const parsed = setPostSeriesSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const result = await adminSeriesService.setPostSeries(c.env, postIdParsed.data, parsed.data.series_id);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});
