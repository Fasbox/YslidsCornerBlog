import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { supabaseService } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export const adminSeriesRouter = Router();
adminSeriesRouter.use(requireAdmin);

const listSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
});

adminSeriesRouter.get("/admin/series", async (req, res, next) => {
  try {
    const parsed = listSchema.safeParse(req.query);
    if (!parsed.success) throw new HttpError(400, "Query inválida", { details: parsed.error.flatten() });

    const { section } = parsed.data;

    const { data, error } = await supabaseService
      .from("series")
      .select("id, section, title, slug, description")
      .eq("section", section)
      .order("title", { ascending: true });

    if (error) throw new HttpError(500, "Error listando series (admin)", { details: error });

    res.json({ items: data ?? [] });
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  section: z.enum(["TECH", "FASEC"]),
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional().nullable(),
});

adminSeriesRouter.post("/admin/series", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Body inválido", { details: parsed.error.flatten() });

    const { data, error } = await supabaseService
      .from("series")
      .insert({
        section: parsed.data.section,
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
      })
      .select("id, section, title, slug, description")
      .single();

    if (error) throw new HttpError(500, "Error creando serie", { details: error });

    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

// --- post series (MVP 0..1) ---
// GET: obtiene serie actual (si existe) para el post
adminSeriesRouter.get("/admin/posts/:id/series", async (req, res, next) => {
  try {
    const postId = z.string().uuid().parse(req.params.id);

    const { data, error } = await supabaseService
      .from("series_posts")
      .select("series_id")
      .eq("post_id", postId)
      .order("position", { ascending: true })
      .limit(1);

    if (error) throw new HttpError(500, "Error consultando serie del post", { details: error });

    const series_id = (data?.[0] as any)?.series_id ?? null;
    res.json({ series_id });
  } catch (e) {
    next(e);
  }
});

const setPostSeriesSchema = z.object({
  series_id: z.string().uuid().nullable(),
});

// PUT: asigna una serie o deja null para quitarla
adminSeriesRouter.put("/admin/posts/:id/series", async (req, res, next) => {
  try {
    const postId = z.string().uuid().parse(req.params.id);
    const parsed = setPostSeriesSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Body inválido", { details: parsed.error.flatten() });

    const seriesId = parsed.data.series_id;

    // limpiar relaciones actuales
    const del = await supabaseService.from("series_posts").delete().eq("post_id", postId);
    if (del.error) throw new HttpError(500, "Error limpiando series del post", { details: del.error });

    // insertar nueva relación si aplica
    if (seriesId) {
      const ins = await supabaseService.from("series_posts").insert({
        post_id: postId,
        series_id: seriesId,
        position: 1,
      });
      if (ins.error) throw new HttpError(500, "Error asignando serie al post", { details: ins.error });
    }

    res.json({ ok: true, post_id: postId, series_id: seriesId });
  } catch (e) {
    next(e);
  }
});
