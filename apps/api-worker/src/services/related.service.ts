// src/services/related.service.ts
import type { Env } from "../config/supabase";
import type { PostSection } from "../repositories/posts.repo";
import * as postsRepo from "../repositories/posts.repo";
import * as postTagsRepo from "../repositories/postTags.repo";
import * as seriesRepo from "../repositories/series.repo";

export async function getRelatedPosts(env: Env, input: { section: PostSection; slug: string; limit: number }) {
  const { section, slug, limit } = input;

  const current = await postsRepo.getPostIdBySlug(env, section, slug);
  if (!current) {
    const err: any = new Error("Post no encontrado");
    err.status = 404;
    err.code = "POST_NOT_FOUND";
    throw err;
  }
  const currentId = current.id;

  const [currentTagIds, currentSeriesIds] = await Promise.all([
    postTagsRepo.loadTagIdsForPost(env, currentId),
    seriesRepo.loadSeriesIdsForPost(env, currentId),
  ]);

  const [byTagsIds, bySeriesIdsRaw] = await Promise.all([
    postsRepo.loadPostIdsByTagIds(env, currentTagIds, section, currentId),
    seriesRepo.loadPostIdsBySeriesIds(env, currentSeriesIds, currentId),
  ]);

  const bySeriesIds = await postsRepo.loadPublishedPostIds(env, bySeriesIdsRaw, section);

  const candidateIds = Array.from(new Set([...bySeriesIds, ...byTagsIds])).slice(0, 60);
  if (candidateIds.length === 0) return { items: [] };

  const sameSeriesSet = new Set(bySeriesIds);
  const sharedCounts = await postTagsRepo.loadSharedTagCounts(env, currentTagIds, candidateIds);

  const posts = await postsRepo.loadPublicPostsByIds(env, candidateIds, section);
  const tagsMap = await postTagsRepo.loadTagsForPosts(env, posts.map((p: any) => p.id));

  const sorted = posts
    .map((p: any) => {
      const shared = sharedCounts.get(p.id) ?? 0;
      const sameSeries = sameSeriesSet.has(p.id);
      return {
        ...p,
        tags: tagsMap.get(p.id) ?? [],
        _score_sameSeries: sameSeries ? 1 : 0,
        _score_sharedTags: shared,
      };
    })
    .sort((a: any, b: any) => {
      if (b._score_sameSeries !== a._score_sameSeries) return b._score_sameSeries - a._score_sameSeries;
      if (b._score_sharedTags !== a._score_sharedTags) return b._score_sharedTags - a._score_sharedTags;
      const ad = a.published_at ? new Date(a.published_at).getTime() : 0;
      const bd = b.published_at ? new Date(b.published_at).getTime() : 0;
      return bd - ad;
    })
    .slice(0, limit)
    .map(({ _score_sameSeries, _score_sharedTags, ...rest }: any) => rest);

  return { items: sorted };
}
