// src/routes/posts.routes.ts
import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../utils/httpError";

import * as postsService from "../services/posts.service";
import * as relatedService from "../services/related.service";
import * as seriesService from "../services/series.service";

export const postsRouter = Router();

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

postsRouter.get("/posts", async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new HttpError(400, "Query inválida", { details: parsed.error.flatten() });

    const result = await postsService.listPosts(parsed.data);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

postsRouter.get("/posts/:section/:slug", async (req, res, next) => {
  try {
    const parsed = postParamsSchema.safeParse(req.params);
    if (!parsed.success) throw new HttpError(400, "Params inválidos", { details: parsed.error.flatten() });

    const { section, slug } = parsed.data;
    const result = await postsService.getPostDetail(section, slug);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

postsRouter.get("/posts/:section/:slug/related", async (req, res, next) => {
  try {
    const paramsParsed = postParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) throw new HttpError(400, "Params inválidos", { details: paramsParsed.error.flatten() });

    const qParsed = relatedQuerySchema.safeParse(req.query);
    if (!qParsed.success) throw new HttpError(400, "Query inválida", { details: qParsed.error.flatten() });

    const { section, slug } = paramsParsed.data;
    const { limit } = qParsed.data;

    const result = await relatedService.getRelatedPosts({ section, slug, limit });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

postsRouter.get("/posts/:section/:slug/series", async (req, res, next) => {
  try {
    const paramsParsed = postParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) throw new HttpError(400, "Params inválidos", { details: paramsParsed.error.flatten() });

    const qParsed = seriesQuerySchema.safeParse(req.query);
    if (!qParsed.success) throw new HttpError(400, "Query inválida", { details: qParsed.error.flatten() });

    const { section, slug } = paramsParsed.data;
    const { limit } = qParsed.data;

    const result = await seriesService.getPostSeriesSidebar({ section, slug, limit });
    res.json(result);
  } catch (e) {
    next(e);
  }
});
