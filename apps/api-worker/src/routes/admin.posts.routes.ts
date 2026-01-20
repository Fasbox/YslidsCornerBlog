// src/routes/admin.posts.routes.ts
import { Hono } from "hono";
import { z } from "zod";
import { jsonError, toErrorResponse } from "../utils/errors";
import { requireAdmin } from "../middlewares/requireAdmin";
import type { AppContext } from "../types/app";
import * as adminPostsService from "../services/adminPosts.service";

export const adminPostsRouter = new Hono<AppContext>();

adminPostsRouter.use("/admin/*", requireAdmin);

const listAdminPostsQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

adminPostsRouter.get("/admin/posts", async (c) => {
  try {
    const parsed = listAdminPostsQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      return jsonError(c, "Query inválida", "BAD_QUERY", 400, parsed.error.flatten());
    }

    const result = await adminPostsService.listAdminPosts(c.env, parsed.data);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

const createPostSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional().nullable(),
  content_json: z.any().default({}),
  content_text: z.string().optional().default(""),
  reading_time: z.number().int().min(0).max(999).optional().default(0),
  cover_image_url: z.string().url().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
});

adminPostsRouter.get("/admin/posts/:id", async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const post = await adminPostsService.getAdminPost(c.env, idParsed.data);
    return c.json(post, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

adminPostsRouter.post("/admin/posts", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const created = await adminPostsService.createPost(c.env, parsed.data);
    return c.json(created, 201);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

const updatePostSchema = createPostSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  published_at: z.string().datetime().optional().nullable(),
});

adminPostsRouter.put("/admin/posts/:id", async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const body = await c.req.json().catch(() => ({}));
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const updated = await adminPostsService.updatePost(c.env, idParsed.data, parsed.data);
    return c.json(updated, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

adminPostsRouter.post("/admin/posts/:id/publish", async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const data = await adminPostsService.publishPost(c.env, idParsed.data);
    return c.json(data, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

adminPostsRouter.post("/admin/posts/:id/unpublish", async (c) => {
  try {
    const idParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!idParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, idParsed.error.flatten());
    }

    const data = await adminPostsService.unpublishPost(c.env, idParsed.data);
    return c.json(data, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

const upsertPostTagsSchema = z.object({
  tag_ids: z.array(z.string().uuid()).max(3),
});

adminPostsRouter.put("/admin/posts/:id/tags", async (c) => {
  try {
    const postIdParsed = z.string().uuid().safeParse(c.req.param("id"));
    if (!postIdParsed.success) {
      return jsonError(c, "Params inválidos", "BAD_PARAMS", 400, postIdParsed.error.flatten());
    }

    const body = await c.req.json().catch(() => ({}));
    const parsed = upsertPostTagsSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(c, "Body inválido", "BAD_BODY", 400, parsed.error.flatten());
    }

    const result = await adminPostsService.replacePostTags(c.env, postIdParsed.data, parsed.data.tag_ids);
    return c.json(result, 200);
  } catch (e) {
    return toErrorResponse(c, e);
  }
});

