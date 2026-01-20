// src/repositories/series.repo.ts
import { supabaseAnon, type Env } from "../config/supabase";

export async function loadSeriesIdsForPost(env: Env, postId: string) {
  const sb = supabaseAnon(env);
  const { data, error } = await sb.from("series_posts").select("series_id").eq("post_id", postId);
  if (error) throw error;

  return Array.from(new Set((data ?? []).map((r: any) => r.series_id as string)));
}

export async function loadPostIdsBySeriesIds(env: Env, seriesIds: string[], excludePostId: string) {
  if (seriesIds.length === 0) return [];
  const sb = supabaseAnon(env);

  const { data, error } = await sb.from("series_posts").select("post_id").in("series_id", seriesIds);
  if (error) throw error;

  return Array.from(new Set((data ?? []).map((r: any) => r.post_id as string))).filter((id) => id !== excludePostId);
}

export async function getFirstSeriesIdForPost(env: Env, postId: string) {
  const sb = supabaseAnon(env);
  const { data, error } = await sb.from("series_posts").select("series_id").eq("post_id", postId);
  if (error) throw error;
  return (data?.[0] as any)?.series_id as string | undefined;
}

export async function getSeriesById(env: Env, seriesId: string) {
  const sb = supabaseAnon(env);
  const { data, error } = await sb
    .from("series")
    .select("id, section, title, slug, description")
    .eq("id", seriesId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listSeriesPostIds(env: Env, seriesId: string, limit: number) {
  const sb = supabaseAnon(env);
  const { data, error } = await sb
    .from("series_posts")
    .select("post_id, position")
    .eq("series_id", seriesId)
    .order("position", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
