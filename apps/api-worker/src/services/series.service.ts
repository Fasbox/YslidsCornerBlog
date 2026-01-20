// src/services/series.service.ts
import type { Env } from "../config/supabase";
import type { PostSection } from "../repositories/posts.repo";
import * as postsRepo from "../repositories/posts.repo";
import * as seriesRepo from "../repositories/series.repo";

export async function getPostSeriesSidebar(env: Env, input: { section: PostSection; slug: string; limit: number }) {
  const { section, slug, limit } = input;

  const current = await postsRepo.getPostIdBySlug(env, section, slug);
  if (!current) {
    const err: any = new Error("Post no encontrado");
    err.status = 404;
    err.code = "POST_NOT_FOUND";
    throw err;
  }
  const postId = current.id;

  const seriesId = await seriesRepo.getFirstSeriesIdForPost(env, postId);
  if (!seriesId) return { series: null, items: [] };

  const serie = await seriesRepo.getSeriesById(env, seriesId);
  if (!serie) return { series: null, items: [] };

  const seriesPosts = await seriesRepo.listSeriesPostIds(env, seriesId, limit);
  const ids = seriesPosts.map((r: any) => r.post_id as string);
  if (ids.length === 0) return { series: serie, items: [] };

  const posts = await postsRepo.loadPublishedPostsForSeries(env, ids, section);

  const posMap = new Map<string, number>(seriesPosts.map((r: any) => [r.post_id as string, r.position as number]));

  const ordered = (posts ?? [])
    .slice()
    .sort((a: any, b: any) => (posMap.get(a.id) ?? 9999) - (posMap.get(b.id) ?? 9999));

  return {
    series: serie,
    current_post_id: postId,
    items: ordered,
  };
}
