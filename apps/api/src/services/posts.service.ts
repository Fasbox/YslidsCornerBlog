// src/services/posts.service.ts
import { HttpError } from "../utils/httpError";
import type { PostSection } from "../repositories/posts.repo";
import * as postsRepo from "../repositories/posts.repo";
import * as tagsRepo from "../repositories/tags.repo";

export async function listPosts(input: {
  section?: PostSection;
  q?: string;
  tag?: string;
  page: number;
  limit: number;
}) {
  const { section, page, limit, q, tag } = input;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let postIdsByTag: string[] | null = null;
  if (tag && tag.trim()) {
    postIdsByTag = await tagsRepo.resolvePostIdsByTagSlug(tag.trim(), section);
    if (postIdsByTag.length === 0) {
      return { page, limit, total: 0, items: [] };
    }
  }

  const { items, total } = await postsRepo.listPosts({
    section,
    q,
    from,
    to,
    postIds: postIdsByTag,
  });

  const tagsMap = await tagsRepo.loadTagsForPosts(items.map((p: any) => p.id));

  return {
    page,
    limit,
    total,
    items: items.map((p: any) => ({
      ...p,
      tags: tagsMap.get(p.id) ?? [],
    })),
  };
}

export async function getPostDetail(section: PostSection, slug: string) {
  const data = await postsRepo.getPostBySlug(section, slug);
  if (!data) throw new HttpError(404, "Post no encontrado", { code: "POST_NOT_FOUND" });

  const tagsMap = await tagsRepo.loadTagsForPosts([data.id]);

  return {
    ...data,
    tags: tagsMap.get(data.id) ?? [],
  };
}
