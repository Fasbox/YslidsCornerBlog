// src/repositories/admin.posts.repo.ts
import { supabaseService, type Env } from "../config/supabase";
import type { PostSection, PostStatus } from "./posts.repo";

export async function listAdminPosts(
  env: Env,
  params: {
    section?: PostSection;
    status?: PostStatus;
    q?: string;
    from: number;
    to: number;
  }
) {
  const sb = supabaseService(env);
  const { section, status, q, from, to } = params;

  let query = sb
    .from("posts")
    .select("id, section, status, title, slug, excerpt, published_at, updated_at, cover_image_url", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (section) query = query.eq("section", section);
  if (status) query = query.eq("status", status);

  if (q && q.trim()) {
    const qq = q.trim();
    query = query.or(`title.ilike.%${qq}%,slug.ilike.%${qq}%,excerpt.ilike.%${qq}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { items: data ?? [], total: count ?? 0 };
}

export async function loadSeriesForPosts(env: Env, postIds: string[]) {
  const map = new Map<string, { id: string; title: string; slug: string }>();
  if (postIds.length === 0) return map;

  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("series_posts")
    .select("post_id, series:series_id(id, title, slug)")
    .in("post_id", postIds);

  if (error) throw error;

  for (const row of data ?? []) {
    const post_id = (row as any).post_id as string;
    const series = (row as any).series as { id: string; title: string; slug: string } | null;
    if (!post_id || !series) continue;
    if (!map.has(post_id)) map.set(post_id, series);
  }

  return map;
}

export async function getAdminPostById(env: Env, id: string) {
  const sb = supabaseService(env);

  const { data, error } = await sb
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

  if (error) throw error;

  const tags = ((data as any)?.post_tags ?? []).map((r: any) => r.tags).filter(Boolean);
  const payload: any = { ...(data as any), tags };
  delete payload.post_tags;

  return payload;
}

export async function createPost(env: Env, input: any) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("posts")
    .insert({ ...input, status: "DRAFT", published_at: null })
    .select("id, section, status, title, slug")
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(env: Env, id: string, patch: any) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("posts")
    .update({ ...patch })
    .eq("id", id)
    .select("id, section, status, title, slug")
    .single();

  if (error) throw error;
  return data;
}

export async function publishPost(env: Env, id: string) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("posts")
    .update({ status: "PUBLISHED", published_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, status, published_at")
    .single();

  if (error) throw error;
  return data;
}

export async function unpublishPost(env: Env, id: string) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("posts")
    .update({ status: "DRAFT", published_at: null })
    .eq("id", id)
    .select("id, status, published_at")
    .single();

  if (error) throw error;
  return data;
}

export async function replacePostTags(env: Env, postId: string, tagIds: string[]) {
  const sb = supabaseService(env);

  const del = await sb.from("post_tags").delete().eq("post_id", postId);
  if (del.error) throw del.error;

  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ post_id: postId, tag_id }));
    const ins = await sb.from("post_tags").insert(rows);
    if (ins.error) throw ins.error;
  }

  return { ok: true, post_id: postId, tag_ids: tagIds };
}
