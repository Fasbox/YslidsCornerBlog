import { supabaseAnon } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";

export async function loadSeriesIdsForPost(postId: string) {
  const { data, error } = await supabaseAnon
    .from("series_posts")
    .select("series_id")
    .eq("post_id", postId);

  if (error) throw new HttpError(500, "Error cargando series del post", { details: error });
  return Array.from(new Set((data ?? []).map((r: any) => r.series_id as string)));
}

export async function loadPostIdsBySeriesIds(seriesIds: string[], excludePostId: string) {
  if (seriesIds.length === 0) return [];

  const { data, error } = await supabaseAnon
    .from("series_posts")
    .select("post_id")
    .in("series_id", seriesIds);

  if (error) throw new HttpError(500, "Error buscando posts por series", { details: error });

  return Array.from(new Set((data ?? []).map((r: any) => r.post_id as string)))
    .filter((id) => id !== excludePostId);
}

export async function getFirstSeriesIdForPost(postId: string) {
  const { data, error } = await supabaseAnon
    .from("series_posts")
    .select("series_id")
    .eq("post_id", postId);

  if (error) throw new HttpError(500, "Error consultando series_posts", { details: error });

  return (data?.[0] as any)?.series_id as string | undefined;
}

export async function getSeriesById(seriesId: string) {
  const { data, error } = await supabaseAnon
    .from("series")
    .select("id, section, title, slug, description")
    .eq("id", seriesId)
    .maybeSingle();

  if (error) throw new HttpError(500, "Error consultando serie", { details: error });
  return data;
}

export async function listSeriesPostIds(seriesId: string, limit: number) {
  const { data, error } = await supabaseAnon
    .from("series_posts")
    .select("post_id, position")
    .eq("series_id", seriesId)
    .order("position", { ascending: true })
    .limit(limit);

  if (error) throw new HttpError(500, "Error consultando series_posts lista", { details: error });
  return data ?? [];
}
