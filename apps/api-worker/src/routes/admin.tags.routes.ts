// src/routes/admin.tags.routes.ts
import { Hono } from "hono";
import { z } from "zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import type { AppContext } from "../types/app";
import { jsonError, toErrorResponse } from "../utils/errors";
import * as tagsService from "../services/tags.service";

export const adminTagsRouter = new Hono<AppContext>();

const listTagsQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
});

const createTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  section: z.enum(["TECH", "FASEC"]).nullable(),
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  section: z.enum(["TECH", "FASEC"]).nullable().optional(),
});

// LIST
adminTagsRouter.get("/admin/tags", requireAdmin, async (c) => {
  try {
    const parsed = listTagsQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      return jsonError(c, "Query inválida", "BAD_QUERY", 400, parsed.error.flatten());
    }

    // Lista todo (admin): global + sección si viene section; o todo si no viene
    const result = await tagsService.listTagsAdmin(c.env, parsed.data.section);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

// CREATE
adminTagsRouter.post("/admin/tags", requireAdmin, async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = createTagSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const item = await tagsService.createTagAdmin(c.env, parsed.data);
    return c.json({ item }, 201);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

// UPDATE
adminTagsRouter.patch("/admin/tags/:id", requireAdmin, async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const body = await c.req.json().catch(() => ({}));
    const parsed = updateTagSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const item = await tagsService.updateTagAdmin(c.env, idParsed.data, parsed.data);
    return c.json({ item }, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

// DELETE
adminTagsRouter.delete("/admin/tags/:id", requireAdmin, async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const result = await tagsService.deleteTagAdmin(c.env, idParsed.data);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});
