// src/services/related.service.ts
import { HttpError } from "../utils/httpError.js";
import type { PostSection } from "../repositories/posts.repo.js";
import * as postsRepo from "../repositories/posts.repo.js";
import * as tagsRepo from "../repositories/tags.repo.js";
import * as seriesRepo from "../repositories/series.repo.js";

export async function getRelatedPosts(input: {
  section: PostSection;
  slug: string;
  limit: number;
}) {
  const { section, slug, limit } = input;

  // 1) post actual minimal
  const current = await postsRepo.getPostIdBySlug(section, slug);
  if (!current) throw new HttpError(404, "Post no encontrado", { code: "POST_NOT_FOUND" });
  const currentId = current.id as string;

  // 2) tag_ids y series_ids
  const [currentTagIds, currentSeriesIds] = await Promise.all([
    tagsRepo.loadTagIdsForPost(currentId),
    seriesRepo.loadSeriesIdsForPost(currentId),
  ]);

  // 3) candidatos
  const [byTagsIds, bySeriesIdsRaw] = await Promise.all([
    postsRepo.loadPostIdsByTagIds(currentTagIds, section, currentId),
    seriesRepo.loadPostIdsBySeriesIds(currentSeriesIds, currentId),
  ]);

  // Filtra serie a publicados y sección (como tú lo hacías)
  const bySeriesIds = await postsRepo.loadPublishedPostIds(bySeriesIdsRaw, section);

  // 4) merge + dedupe + cap
  const candidateIds = Array.from(new Set([...bySeriesIds, ...byTagsIds])).slice(0, 60);
  if (candidateIds.length === 0) return { items: [] };

  // 5) scoring
  const sameSeriesSet = new Set(bySeriesIds);
  const sharedCounts = await tagsRepo.loadSharedTagCounts(currentTagIds, candidateIds);

  // 6) posts públicos
  const posts = await postsRepo.loadPublicPostsByIds(candidateIds, section);

  // 7) tags map
  const tagsMap = await tagsRepo.loadTagsForPosts(posts.map((p: any) => p.id));

  // 8) sort final (idéntico a tu criterio)
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
