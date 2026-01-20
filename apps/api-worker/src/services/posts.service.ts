// src/services/posts.service.ts
import type { Env } from "../config/supabase";
import type { PostSection } from "../repositories/posts.repo";
import * as postsRepo from "../repositories/posts.repo";
import * as postTagsRepo from "../repositories/postTags.repo";

export async function listPosts(
  env: Env,
  input: { section?: PostSection; q?: string; tag?: string; page: number; limit: number }
) {
  const { section, page, limit, q, tag } = input;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let postIdsByTag: string[] | null = null;
  if (tag && tag.trim()) {
    postIdsByTag = await postTagsRepo.resolvePostIdsByTagSlug(env, tag.trim(), section);
    if (postIdsByTag.length === 0) {
      return { page, limit, total: 0, items: [] };
    }
  }

  const { items, total } = await postsRepo.listPublishedPosts(env, {
    section,
    q,
    from,
    to,
    postIds: postIdsByTag,
  });

  const tagsMap = await postTagsRepo.loadTagsForPosts(env, items.map((p) => p.id));

  return {
    page,
    limit,
    total,
    items: items.map((p) => ({
      ...p,
      tags: tagsMap.get(p.id) ?? [],
    })),
  };
}

export async function getPostDetail(env: Env, section: PostSection, slug: string) {
  const data = await postsRepo.getPublishedPostBySlug(env, section, slug);
  if (!data) {
    const err: any = new Error("Post no encontrado");
    err.status = 404;
    err.code = "POST_NOT_FOUND";
    throw err;
  }

  const tagsMap = await postTagsRepo.loadTagsForPosts(env, [data.id]);

  return {
    ...data,
    tags: tagsMap.get(data.id) ?? [],
  };
}
