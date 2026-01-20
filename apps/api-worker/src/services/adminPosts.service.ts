// src/services/adminPosts.service.ts
import type { Env } from "../config/supabase";
import type { PostSection, PostStatus } from "../repositories/posts.repo";
import * as adminPostsRepo from "../repositories/admin.posts.repo";
import * as tagsRepo from "../repositories/tags.repo";

export async function listAdminPosts(
  env: Env,
  input: { section?: PostSection; status?: PostStatus; q?: string; page: number; limit: number }
) {
  const { section, status, q, page, limit } = input;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { items, total } = await adminPostsRepo.listAdminPosts(env, { section, status, q, from, to });

  const postIds = items.map((p: any) => p.id).filter(Boolean);

  const [seriesByPostId, tagsByPostId] = await Promise.all([
    adminPostsRepo.loadSeriesForPosts(env, postIds),
    tagsRepo.loadTagsForPostsAdmin(env, postIds),
  ]);

  const merged = items.map((p: any) => ({
    ...p,
    series: seriesByPostId.get(p.id) ?? null,
    tags: tagsByPostId.get(p.id) ?? [],
  }));

  return { items: merged, page, limit, total };
}

export async function getAdminPost(env: Env, id: string) {
  return adminPostsRepo.getAdminPostById(env, id);
}

export async function createPost(env: Env, input: any) {
  return adminPostsRepo.createPost(env, input);
}

export async function updatePost(env: Env, id: string, patch: any) {
  return adminPostsRepo.updatePost(env, id, patch);
}

export async function publishPost(env: Env, id: string) {
  return adminPostsRepo.publishPost(env, id);
}

export async function unpublishPost(env: Env, id: string) {
  return adminPostsRepo.unpublishPost(env, id);
}

export async function replacePostTags(env: Env, postId: string, tagIds: string[]) {
  return adminPostsRepo.replacePostTags(env, postId, tagIds);
}
