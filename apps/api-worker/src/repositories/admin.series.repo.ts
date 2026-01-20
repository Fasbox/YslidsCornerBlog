// src/repositories/admin.series.repo.ts
import { supabaseService, type Env } from "../config/supabase";
import type { PostSection } from "./posts.repo";

export async function listSeries(env: Env, section: PostSection) {
  const sb = supabaseService(env);

  const { data, error } = await sb
    .from("series")
    .select("id, section, title, slug, description")
    .eq("section", section)
    .order("title", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createSeries(env: Env, input: { section: PostSection; title: string; slug: string; description?: string | null }) {
  const sb = supabaseService(env);

  const { data, error } = await sb
    .from("series")
    .insert({
      section: input.section,
      title: input.title,
      slug: input.slug,
      description: input.description ?? null,
    })
    .select("id, section, title, slug, description")
    .single();

  if (error) throw error;
  return data;
}

export async function getPostSeriesId(env: Env, postId: string) {
  const sb = supabaseService(env);

  const { data, error } = await sb
    .from("series_posts")
    .select("series_id")
    .eq("post_id", postId)
    .order("position", { ascending: true })
    .limit(1);

  if (error) throw error;
  return (data?.[0] as any)?.series_id ?? null;
}

export async function setPostSeries(env: Env, postId: string, seriesId: string | null) {
  const sb = supabaseService(env);

  const del = await sb.from("series_posts").delete().eq("post_id", postId);
  if (del.error) throw del.error;

  if (seriesId) {
    const ins = await sb.from("series_posts").insert({ post_id: postId, series_id: seriesId, position: 1 });
    if (ins.error) throw ins.error;
  }

  return { ok: true, post_id: postId, series_id: seriesId };
}
