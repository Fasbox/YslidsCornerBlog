import { Router } from "express";
import { z } from "zod";
import { supabaseAnon } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export const tagsRouter = Router();

const listTagsQuerySchema = z.object({
  section: z.enum(["TECH", "FASEC"]).optional(),
});

tagsRouter.get("/tags", async (req, res, next) => {
  try {
    const parsed = listTagsQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new HttpError(400, "Query inválida", { details: parsed.error.flatten() });

    const { section } = parsed.data;

    let q = supabaseAnon
      .from("tags")
      .select("id, section, name, slug, created_at")
      .order("name", { ascending: true });

    // ✅ si viene section: traer (global NULL) + (misma section)
    if (section) {
      q = q.or(`section.is.null,section.eq.${section}`);
    }

    const { data, error } = await q;
    if (error) throw new HttpError(500, "Error consultando tags", { details: error });

    res.json({ items: data ?? [] });
  } catch (e) {
    next(e);
  }
});
