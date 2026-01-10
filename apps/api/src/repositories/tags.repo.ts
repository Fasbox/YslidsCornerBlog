import { supabaseAnon } from "../config/supabase.js";
import { HttpError } from "../utils/httpError.js";
import type { PostSection } from "./posts.repo.js";

export type TagPublic = { name: string; slug: string; section: PostSection | null };

export async function loadTagsForPosts(postIds: string[]) {
  const map = new Map<string, TagPublic[]>();
  if (postIds.length === 0) return map;

  const { data, error } = await supabaseAnon
    .from("post_tags")
    .select("post_id, tags(name, slug, section)")
    .in("post_id", postIds);

  if (error) throw new HttpError(500, "Error cargando tags de posts", { details: error });

  for (const row of data ?? []) {
    const postId = (row as any).post_id as string;
    const t = (row as any).tags as { name: string; slug: string; section: any } | null;
    if (!t) continue;

    const arr = map.get(postId) ?? [];
    arr.push({ name: t.name, slug: t.slug, section: t.section ?? null });
    map.set(postId, arr);
  }

  return map;
}

export async function resolvePostIdsByTagSlug(tagSlug: string, section?: PostSection) {
  const slug = tagSlug.trim().toLowerCase();
  if (!slug) return [];

  let tagsQ = supabaseAnon.from("tags").select("id").eq("slug", slug);

  if (section) {
    tagsQ = tagsQ.or(`section.is.null,section.eq.${section}`);
  }

  const { data: tags, error: tagsErr } = await tagsQ;
  if (tagsErr) throw new HttpError(500, "Error buscando tags", { details: tagsErr });

  const tagIds = (tags ?? []).map((t: any) => t.id as string);
  if (tagIds.length === 0) return [];

  const { data: rows, error: ptErr } = await supabaseAnon
    .from("post_tags")
    .select("post_id")
    .in("tag_id", tagIds);

  if (ptErr) throw new HttpError(500, "Error buscando posts por tag", { details: ptErr });

  return Array.from(new Set((rows ?? []).map((r: any) => r.post_id as string)));
}

export async function loadTagIdsForPost(postId: string) {
  const { data, error } = await supabaseAnon
    .from("post_tags")
    .select("tag_id")
    .eq("post_id", postId);

  if (error) throw new HttpError(500, "Error cargando tag_ids del post", { details: error });
  return (data ?? []).map((r: any) => r.tag_id as string);
}

export async function loadSharedTagCounts(currentTagIds: string[], candidatePostIds: string[]) {
  const counts = new Map<string, number>();
  if (currentTagIds.length === 0 || candidatePostIds.length === 0) return counts;

  const { data, error } = await supabaseAnon
    .from("post_tags")
    .select("post_id, tag_id")
    .in("post_id", candidatePostIds)
    .in("tag_id", currentTagIds);

  if (error) throw new HttpError(500, "Error calculando tags en común", { details: error });

  for (const row of data ?? []) {
    const pid = (row as any).post_id as string;
    counts.set(pid, (counts.get(pid) ?? 0) + 1);
  }

  return counts;
}
