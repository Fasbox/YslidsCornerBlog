// src/repositories/tags.repo.ts
import { supabaseAnon, supabaseService, type Env } from "../config/supabase";
import { HttpError } from "../utils/httpError";
import type { PostSection } from "./posts.repo";

export type TagRow = {
  id: string;
  section: PostSection | null;
  name: string;
  slug: string;
  created_at: string;
};

export async function listTags(env: Env, section?: PostSection) {
  const sb = supabaseAnon(env);

  let q = sb
    .from("tags")
    .select("id, section, name, slug, created_at")
    .order("name", { ascending: true });

  // si viene section: traer (global NULL) + (misma section)
  if (section) {
    q = q.or(`section.is.null,section.eq.${section}`);
  }

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as TagRow[];
}

export async function listTagsAdmin(env: Env, section?: PostSection) {
  const sb = supabaseService(env);

  let q = sb
    .from("tags")
    .select("id, section, name, slug, created_at")
    .order("name", { ascending: true });

  // mismo comportamiento UX: si viene section => incluye global + sección
  if (section) q = q.or(`section.is.null,section.eq.${section}`);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []) as TagRow[];
}

export async function loadTagsForPostsAdmin(env: Env, postIds: string[]) {
  const sb = supabaseService(env);

  const map = new Map<string, TagRow[]>();
  if (postIds.length === 0) return map;

  const { data, error } = await sb
    .from("post_tags")
    .select("post_id, tags(id, section, name, slug, created_at)")
    .in("post_id", postIds);

  if (error) throw new HttpError(500, "Error cargando tags (admin)", { details: error });

  for (const row of data ?? []) {
    const postId = (row as any).post_id as string;
    const t = (row as any).tags as TagRow | null;
    if (!t) continue;

    const arr = map.get(postId) ?? [];
    arr.push(t);
    map.set(postId, arr);
  }

  return map;
}

export async function createTagAdmin(
  env: Env,
  input: { name: string; slug: string; section: PostSection | null }
) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("tags")
    .insert({
      name: input.name,
      slug: input.slug,
      section: input.section,
    })
    .select("id, section, name, slug, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function updateTagAdmin(
  env: Env,
  id: string,
  patch: Partial<{ name: string; slug: string; section: PostSection | null }>
) {
  const sb = supabaseService(env);
  const { data, error } = await sb
    .from("tags")
    .update(patch)
    .eq("id", id)
    .select("id, section, name, slug, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTagAdmin(env: Env, id: string) {
  const sb = supabaseService(env);

  // opcional: evita borrar tags usados por posts
  const { count, error: countErr } = await sb
    .from("post_tags")
    .select("post_id", { count: "exact", head: true })
    .eq("tag_id", id);

  if (countErr) throw countErr;
  if ((count ?? 0) > 0) {
    const err: any = new Error("No puedes borrar un tag en uso por posts.");
    err.status = 409;
    err.code = "TAG_IN_USE";
    throw err;
  }

  const { error } = await sb.from("tags").delete().eq("id", id);
  if (error) throw error;

  return { ok: true };
}