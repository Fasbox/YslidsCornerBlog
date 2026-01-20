// src/routes/tags.routes.ts
import { Hono } from "hono";
import { z } from "zod";
import { jsonError, toErrorResponse } from "../utils/errors";
import type { AppContext } from "../types/app";
import * as tagsService from "../services/tags.service";

export const tagsRouter = new Hono<AppContext>();

const listTagsQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
});

tagsRouter.get("/tags", async (c) => {
  try {
    const parsed = listTagsQuerySchema.safeParse(c.req.query());
    if (!parsed.success) return jsonError(c, "Query inválida", "BAD_QUERY", 400, parsed.error.flatten());

    const result = await tagsService.listTags(c.env, parsed.data.section);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});
