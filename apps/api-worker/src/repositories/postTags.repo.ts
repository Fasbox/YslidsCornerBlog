// src/repositories/postTags.repo.ts
import { supabaseAnon, type Env } from "../config/supabase";
import type { PostSection } from "./posts.repo";

export type TagPublic = { name: string; slug: string; section: PostSection | null };

export async function loadTagsForPosts(env: Env, postIds: string[]) {
  const map = new Map<string, TagPublic[]>();
  if (postIds.length === 0) return map;

  const sb = supabaseAnon(env);
  const { data, error } = await sb.from("post_tags").select("post_id, tags(name, slug, section)").in("post_id", postIds);
  if (error) throw error;

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

export async function resolvePostIdsByTagSlug(env: Env, tagSlug: string, section?: PostSection) {
  const slug = tagSlug.trim().toLowerCase();
  if (!slug) return [];

  const sb = supabaseAnon(env);

  let tagsQ = sb.from("tags").select("id").eq("slug", slug);
  if (section) {
    tagsQ = tagsQ.or(`section.is.null,section.eq.${section}`);
  }

  const { data: tags, error: tagsErr } = await tagsQ;
  if (tagsErr) throw tagsErr;

  const tagIds = (tags ?? []).map((t: any) => t.id as string);
  if (tagIds.length === 0) return [];

  const { data: rows, error: ptErr } = await sb.from("post_tags").select("post_id").in("tag_id", tagIds);
  if (ptErr) throw ptErr;

  return Array.from(new Set((rows ?? []).map((r: any) => r.post_id as string)));
}

export async function loadTagIdsForPost(env: Env, postId: string) {
  const sb = supabaseAnon(env);
  const { data, error } = await sb.from("post_tags").select("tag_id").eq("post_id", postId);
  if (error) throw error;

  return (data ?? []).map((r: any) => r.tag_id as string);
}

export async function loadSharedTagCounts(env: Env, currentTagIds: string[], candidatePostIds: string[]) {
  const counts = new Map<string, number>();
  if (currentTagIds.length === 0 || candidatePostIds.length === 0) return counts;

  const sb = supabaseAnon(env);
  const { data, error } = await sb
    .from("post_tags")
    .select("post_id, tag_id")
    .in("post_id", candidatePostIds)
    .in("tag_id", currentTagIds);

  if (error) throw error;

  for (const row of data ?? []) {
    const pid = (row as any).post_id as string;
    counts.set(pid, (counts.get(pid) ?? 0) + 1);
  }

  return counts;
}
