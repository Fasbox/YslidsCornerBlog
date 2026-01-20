// src/routes/posts.routes.ts
import { Hono } from "hono";
import { z } from "zod";
import { jsonError, toErrorResponse } from "../utils/errors";
import type { AppContext } from "../types/app";
import * as postsService from "../services/posts.service";
import * as relatedService from "../services/related.service";
import * as seriesService from "../services/series.service";

export const postsRouter = new Hono<AppContext>();

const listQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
  q: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const postParamsSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
  slug: z.string().min(1),
});

const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

const seriesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

postsRouter.get("/posts", async (c) => {
  try {
    const parsed = listQuerySchema.safeParse(c.req.query());
    if (!parsed.success) return jsonError(c, "Query inválida", "BAD_QUERY", 400, parsed.error.flatten());

    const result = await postsService.listPosts(c.env, parsed.data);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

postsRouter.get("/posts/:section/:slug", async (c) => {
  try {
    const parsed = postParamsSchema.safeParse(c.req.param());
    if (!parsed.success) return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, parsed.error.flatten());

    const result = await postsService.getPostDetail(c.env, parsed.data.section, parsed.data.slug);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

postsRouter.get("/posts/:section/:slug/related", async (c) => {
  try {
    const paramsParsed = postParamsSchema.safeParse(c.req.param());
    if (!paramsParsed.success) return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, paramsParsed.error.flatten());

    const qParsed = relatedQuerySchema.safeParse(c.req.query());
    if (!qParsed.success) return jsonError(c, "Query inválida", "BAD_QUERY", 400, qParsed.error.flatten());

    const result = await relatedService.getRelatedPosts(c.env, {
      section: paramsParsed.data.section,
      slug: paramsParsed.data.slug,
      limit: qParsed.data.limit,
    });

    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

postsRouter.get("/posts/:section/:slug/series", async (c) => {
  try {
    const paramsParsed = postParamsSchema.safeParse(c.req.param());
    if (!paramsParsed.success) return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, paramsParsed.error.flatten());

    const qParsed = seriesQuerySchema.safeParse(c.req.query());
    if (!qParsed.success) return jsonError(c, "Query inválida", "BAD_QUERY", 400, qParsed.error.flatten());

    const result = await seriesService.getPostSeriesSidebar(c.env, {
      section: paramsParsed.data.section,
      slug: paramsParsed.data.slug,
      limit: qParsed.data.limit,
    });

    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});
