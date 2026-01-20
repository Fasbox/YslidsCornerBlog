// src/services/tags.service.ts
import type { Env } from "../config/supabase";
import type { PostSection } from "../repositories/posts.repo";
import * as tagsRepo from "../repositories/tags.repo";

export async function listTags(env: Env, section?: PostSection) {
  const items = await tagsRepo.listTags(env, section);
  return { items };
}

export async function listTagsAdmin(env: Env, section?: PostSection) {
  const items = await tagsRepo.listTagsAdmin(env, section);
  return { items };
}

export async function createTagAdmin(
  env: Env,
  input: { name: string; slug?: string; section: PostSection | null }
) {
  const name = input.name.trim();
  if (!name) {
    const err: any = new Error("Nombre requerido");
    err.status = 400;
    throw err;
  }

  // slug: si no lo mandan, lo generas en front; acá igual aseguras
  const slug = (input.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (!slug) {
    const err: any = new Error("Slug requerido");
    err.status = 400;
    throw err;
  }

  return tagsRepo.createTagAdmin(env, { name, slug, section: input.section });
}

export async function updateTagAdmin(
  env: Env,
  id: string,
  patch: Partial<{ name: string; slug: string; section: PostSection | null }>
) {
  const normalized: any = {};

  if (typeof patch.name === "string") normalized.name = patch.name.trim();
  if (typeof patch.slug === "string") normalized.slug = patch.slug.trim().toLowerCase();
  if (patch.section === "TECH" || patch.section === "FASEC" || patch.section === null) {
    normalized.section = patch.section;
  }

  return tagsRepo.updateTagAdmin(env, id, normalized);
}

export async function deleteTagAdmin(env: Env, id: string) {
  return tagsRepo.deleteTagAdmin(env, id);
}