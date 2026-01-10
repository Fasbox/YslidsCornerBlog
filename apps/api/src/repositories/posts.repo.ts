import { supabaseAnon } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export type PostSection = "TECH" | "FASEC";

export async function listPosts(params: {
  section?: PostSection;
  q?: string;
  from: number;
  to: number;
  postIds?: string[] | null;
}) {
  const { section, q, from, to, postIds } = params;

  let query = supabaseAnon
    .from("posts")
    .select(
      "id, section, status, title, slug, excerpt, reading_time, published_at, created_at, updated_at, cover_image_url",
      { count: "exact" }
    )
    .order("published_at", { ascending: false })
    .range(from, to);

  if (section) query = query.eq("section", section);

  if (q && q.trim()) {
    const qq = q.trim();
    query = query.or(
      `title.ilike.%${qq}%,slug.ilike.%${qq}%,excerpt.ilike.%${qq}%,content_text.ilike.%${qq}%`
    );
  }

  if (postIds) query = query.in("id", postIds);

  const { data, error, count } = await query;
  if (error) throw new HttpError(500, "Error consultando posts", { details: error });

  return { items: data ?? [], total: count ?? 0 };
}

export async function getPostBySlug(section: PostSection, slug: string) {
  const { data, error } = await supabaseAnon
    .from("posts")
    .select(
      "id, section, status, title, slug, excerpt, content_json, content_text, reading_time, published_at, created_at, updated_at, cover_image_url"
    )
    .eq("section", section)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new HttpError(500, "Error consultando post", { details: error });
  return data;
}

export async function getPostIdBySlug(section: PostSection, slug: string) {
  const { data, error } = await supabaseAnon
    .from("posts")
    .select("id, section, slug, status")
    .eq("section", section)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new HttpError(500, "Error consultando post actual", { details: error });
  return data;
}

/**
 * Tu loadPostIdsByTagIds tal cual (incluye filtro published+section)
 */
export async function loadPostIdsByTagIds(tagIds: string[], section: PostSection, excludePostId: string) {
  if (tagIds.length === 0) return [];

  const { data, error } = await supabaseAnon
    .from("post_tags")
    .select("post_id")
    .in("tag_id", tagIds);

  if (error) throw new HttpError(500, "Error buscando posts por tag_ids", { details: error });

  const ids = Array.from(new Set((data ?? []).map((r: any) => r.post_id as string)))
    .filter((id) => id !== excludePostId);

  if (ids.length === 0) return [];

  const { data: posts, error: postsErr } = await supabaseAnon
    .from("posts")
    .select("id")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED");

  if (postsErr) throw new HttpError(500, "Error filtrando posts publicados (tags)", { details: postsErr });

  return (posts ?? []).map((p: any) => p.id as string);
}

export async function loadPublicPostsByIds(ids: string[], section: PostSection) {
  if (ids.length === 0) return [];

  const { data, error } = await supabaseAnon
    .from("posts")
    .select("id, section, title, slug, excerpt, cover_image_url, reading_time, published_at")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });

  if (error) throw new HttpError(500, "Error cargando posts relacionados", { details: error });

  return data ?? [];
}

export async function loadPublishedPostIds(ids: string[], section: PostSection) {
  if (ids.length === 0) return [];

  const { data, error } = await supabaseAnon
    .from("posts")
    .select("id")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED");

  if (error) throw new HttpError(500, "Error filtrando posts publicados", { details: error });

  return (data ?? []).map((p: any) => p.id as string);
}

export async function loadPublishedPostsForSeries(ids: string[], section: PostSection) {
  if (ids.length === 0) return [];

  const { data, error } = await supabaseAnon
    .from("posts")
    .select("id, section, title, slug, excerpt, reading_time, published_at, cover_image_url, status")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED");

  if (error) throw new HttpError(500, "Error cargando posts de serie", { details: error });

  return data ?? [];
}
