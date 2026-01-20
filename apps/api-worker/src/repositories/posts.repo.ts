// src/repositories/posts.repo.ts
import { supabaseAnon, type Env } from "../config/supabase";

export type PostSection = "TECH" | "FASEC";
export type PostStatus = "DRAFT" | "PUBLISHED";

export type PublicPostListItem = {
  id: string;
  section: PostSection;
  status: PostStatus;
  title: string;
  slug: string;
  excerpt: string | null;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
};

export type PublicPostDetail = {
  id: string;
  section: PostSection;
  status: PostStatus;
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: any;
  content_text: string | null;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  category_id: string | null;
};

export async function listPublishedPosts(
  env: Env,
  params: {
    section?: PostSection;
    q?: string;
    from: number;
    to: number;
    postIds?: string[] | null;
  }
) {
  const { section, q, from, to, postIds } = params;

  const sb = supabaseAnon(env);

  // ---- 1) COUNT primero (head:true no trae filas) ----
  let countQ = sb
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "PUBLISHED");

  if (section) countQ = countQ.eq("section", section);

  if (q && q.trim()) {
    const qq = q.trim();
    // OJO: en count también aplicamos el filtro, para que total sea consistente
    countQ = countQ.or(
      `title.ilike.%${qq}%,slug.ilike.%${qq}%,excerpt.ilike.%${qq}%,content_text.ilike.%${qq}%`
    );
  }

  if (postIds) countQ = countQ.in("id", postIds);

  const { count, error: countErr } = await countQ;
  if (countErr) throw countErr;

  const total = count ?? 0;

  // Si te sales del total: NO consultes range, devuelve vacío
  if (total === 0 || from >= total) {
    return { items: [], total };
  }

  // ---- 2) Query real con range ----
  let dataQ = sb
    .from("posts")
    .select(
      "id, section, status, title, slug, excerpt, reading_time, published_at, created_at, updated_at, cover_image_url"
    )
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (section) dataQ = dataQ.eq("section", section);

  if (q && q.trim()) {
    const qq = q.trim();
    dataQ = dataQ.or(
      `title.ilike.%${qq}%,slug.ilike.%${qq}%,excerpt.ilike.%${qq}%,content_text.ilike.%${qq}%`
    );
  }

  if (postIds) dataQ = dataQ.in("id", postIds);

  const { data, error } = await dataQ;
  if (error) throw error;

  return { items: data ?? [], total };
}

export async function getPublishedPostBySlug(env: Env, section: PostSection, slug: string) {
  const sb = supabaseAnon(env);

  const { data, error } = await sb
    .from("posts")
    .select(
      "id, section, status, title, slug, excerpt, content_json, content_text, reading_time, published_at, created_at, updated_at, cover_image_url, category_id"
    )
    .eq("status", "PUBLISHED")
    .eq("section", section)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as PublicPostDetail | null;
}

export async function getPostIdBySlug(env: Env, section: PostSection, slug: string) {
  const sb = supabaseAnon(env);

  const { data, error } = await sb
    .from("posts")
    .select("id, section, slug, status")
    .eq("section", section)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as { id: string; section: PostSection; slug: string; status: PostStatus } | null;
}

export async function loadPostIdsByTagIds(env: Env, tagIds: string[], section: PostSection, excludePostId: string) {
  if (tagIds.length === 0) return [];
  const sb = supabaseAnon(env);

  const { data, error } = await sb.from("post_tags").select("post_id").in("tag_id", tagIds);
  if (error) throw error;

  const ids = Array.from(new Set((data ?? []).map((r: any) => r.post_id as string))).filter((id) => id !== excludePostId);
  if (ids.length === 0) return [];

  const { data: posts, error: postsErr } = await sb
    .from("posts")
    .select("id")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED");

  if (postsErr) throw postsErr;
  return (posts ?? []).map((p: any) => p.id as string);
}

export async function loadPublicPostsByIds(env: Env, ids: string[], section: PostSection) {
  if (ids.length === 0) return [];
  const sb = supabaseAnon(env);

  const { data, error } = await sb
    .from("posts")
    .select("id, section, title, slug, excerpt, cover_image_url, reading_time, published_at")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function loadPublishedPostIds(env: Env, ids: string[], section: PostSection) {
  if (ids.length === 0) return [];
  const sb = supabaseAnon(env);

  const { data, error } = await sb.from("posts").select("id").in("id", ids).eq("section", section).eq("status", "PUBLISHED");
  if (error) throw error;

  return (data ?? []).map((p: any) => p.id as string);
}

export async function loadPublishedPostsForSeries(env: Env, ids: string[], section: PostSection) {
  if (ids.length === 0) return [];
  const sb = supabaseAnon(env);

  const { data, error } = await sb
    .from("posts")
    .select("id, section, title, slug, excerpt, reading_time, published_at, cover_image_url, status")
    .in("id", ids)
    .eq("section", section)
    .eq("status", "PUBLISHED");

  if (error) throw error;
  return data ?? [];
}
