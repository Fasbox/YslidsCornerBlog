import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { supabaseService } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export const adminPostsRouter = Router();

adminPostsRouter.use(requireAdmin);

const listAdminPostsQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

adminPostsRouter.get("/admin/posts", async (req, res, next) => {
  try {
    const parsed = listAdminPostsQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new HttpError(400, "Query inválida", { details: parsed.error.flatten() });

    const { section, status, q, page, limit } = parsed.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseService
      .from("posts")
      .select("id, section, status, title, slug, excerpt, published_at, updated_at, cover_image_url", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (section) query = query.eq("section", section);
    if (status) query = query.eq("status", status);

    if (q && q.trim()) {
      const qq = q.trim();
      // búsqueda simple MVP
      query = query.or(`title.ilike.%${qq}%,slug.ilike.%${qq}%,excerpt.ilike.%${qq}%`);
    }

    const { data, error, count } = await query;
    const postIds = (data ?? []).map((p: any) => p.id).filter(Boolean);

    let seriesByPostId = new Map<string, { id: string; title: string; slug: string }>();

    if (postIds.length > 0) {
      const { data: spRows, error: spErr } = await supabaseService
        .from("series_posts")
        .select("post_id, series:series_id(id, title, slug)")
        .in("post_id", postIds);

      if (spErr) throw new HttpError(500, "Error cargando series del listado admin", { details: spErr });

      for (const row of spRows ?? []) {
        const post_id = (row as any).post_id as string;
        const series = (row as any).series as { id: string; title: string; slug: string } | null;
        if (!post_id || !series) continue;

        // si un post tiene varias series, nos quedamos con la primera que aparezca
        if (!seriesByPostId.has(post_id)) {
          seriesByPostId.set(post_id, series);
        }
      }
    }

    const items = (data ?? []).map((p: any) => ({
      ...p,
      series: seriesByPostId.get(p.id) ?? null,
    }));

    res.json({
      items,
      page,
      limit,
      total: count ?? 0,
    });

    if (error) throw new HttpError(500, "Error listando posts (admin)", { details: error });
  } catch (e) {
    next(e);
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

adminPostsRouter.get("/admin/posts/:id", async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);

    const { data, error } = await supabaseService
      .from("posts")
      .select(
        `
          id, section, status, title, slug, excerpt,
          content_json, content_text, reading_time, published_at, cover_image_url, category_id,
          created_at, updated_at,
          post_tags(
            tags(id, name, slug, section)
          )
        `
      )
      .eq("id", id)
      .single();

    if (error) throw new HttpError(500, "Error consultando post (admin)", { details: error });

    const tags = ((data as any)?.post_tags ?? [])
      .map((r: any) => r.tags)
      .filter(Boolean);

    const payload = {
      ...(data as any),
      tags,
    };

    // opcional: no mandar post_tags al frontend
    delete (payload as any).post_tags;

    res.json(payload);
  } catch (e) {
    next(e);
  }
});


adminPostsRouter.post("/admin/posts", async (req, res, next) => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Body inválido", { details: parsed.error.flatten() });

    const { data, error } = await supabaseService
      .from("posts")
      .insert({
        ...parsed.data,
        status: "DRAFT",
        published_at: null,
      })
      .select("id, section, status, title, slug")
      .single();

    if (error) throw new HttpError(500, "Error creando post", { details: error });

    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

const updatePostSchema = createPostSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  published_at: z.string().datetime().optional().nullable(),
});

adminPostsRouter.put("/admin/posts/:id", async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const parsed = updatePostSchema.safeParse(req.body);
    const { data: tagRows, error: tagErr } = await supabaseService
    .from("post_tags")
    .select("tags(id, name, slug, section)")
    .eq("post_id", id);
    if (!parsed.success) throw new HttpError(400, "Body inválido", { details: parsed.error.flatten() });

    const { data, error } = await supabaseService
      .from("posts")
      .update({
        ...parsed.data,
      })
      .eq("id", id)
      .select("id, section, status, title, slug")
      .single();

    if (tagErr) throw new HttpError(500, "Error cargando tags del post", { details: tagErr });

    const tags = (tagRows ?? [])
      .map((r: any) => r.tags)
      .filter(Boolean);

    if (error) throw new HttpError(500, "Error actualizando post", { details: error });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

adminPostsRouter.post("/admin/posts/:id/publish", async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);

    const { data, error } = await supabaseService
      .from("posts")
      .update({ status: "PUBLISHED", published_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status, published_at")
      .single();

    if (error) throw new HttpError(500, "Error publicando", { details: error });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

adminPostsRouter.post("/admin/posts/:id/unpublish", async (req, res, next) => {
  try {
    const id = z.string().uuid().parse(req.params.id);

    const { data, error } = await supabaseService
      .from("posts")
      .update({ status: "DRAFT", published_at: null })
      .eq("id", id)
      .select("id, status, published_at")
      .single();

    if (error) throw new HttpError(500, "Error despublicando", { details: error });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

const upsertPostTagsSchema = z.object({
  tag_ids: z.array(z.string().uuid()).max(3),
});

adminPostsRouter.put("/admin/posts/:id/tags", async (req, res, next) => {
  try {
    const postId = z.string().uuid().parse(req.params.id);

    const parsed = upsertPostTagsSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Body inválido", { details: parsed.error.flatten() });

    const tagIds = parsed.data.tag_ids;

    // 1) limpiar relaciones actuales
    const del = await supabaseService.from("post_tags").delete().eq("post_id", postId);
    if (del.error) throw new HttpError(500, "Error limpiando tags del post", { details: del.error });

    // 2) insertar nuevas relaciones
    if (tagIds.length > 0) {
      const rows = tagIds.map((tag_id) => ({ post_id: postId, tag_id }));
      const ins = await supabaseService.from("post_tags").insert(rows);
      if (ins.error) throw new HttpError(500, "Error asignando tags al post", { details: ins.error });
    }

    res.json({ ok: true, post_id: postId, tag_ids: tagIds });
  } catch (e) {
    next(e);
  }
});

