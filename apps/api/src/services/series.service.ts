// src/services/series.service.ts
import { HttpError } from "../utils/httpError.js";
import type { PostSection } from "../repositories/posts.repo.js";
import * as postsRepo from "../repositories/posts.repo.js";
import * as seriesRepo from "../repositories/series.repo.js";

export async function getPostSeriesSidebar(input: {
  section: PostSection;
  slug: string;
  limit: number;
}) {
  const { section, slug, limit } = input;

  // 1) post actual
  const current = await postsRepo.getPostIdBySlug(section, slug);
  if (!current) throw new HttpError(404, "Post no encontrado", { code: "POST_NOT_FOUND" });
  const postId = current.id as string;

  // 2) primera serie (MVP)
  const seriesId = await seriesRepo.getFirstSeriesIdForPost(postId);
  if (!seriesId) return { series: null, items: [] };

  // 3) meta serie
  const serie = await seriesRepo.getSeriesById(seriesId);
  if (!serie) return { series: null, items: [] };

  // 4) posts ids con position
  const seriesPosts = await seriesRepo.listSeriesPostIds(seriesId, limit);
  const ids = (seriesPosts ?? []).map((r: any) => r.post_id as string);
  if (ids.length === 0) return { series: serie, items: [] };

  // 5) carga posts publicados
  const posts = await postsRepo.loadPublishedPostsForSeries(ids, section);

  // 6) mantener el orden por position
  const posMap = new Map<string, number>(
    (seriesPosts ?? []).map((r: any) => [r.post_id as string, r.position as number])
  );

  const ordered = (posts ?? [])
    .slice()
    .sort((a: any, b: any) => (posMap.get(a.id) ?? 9999) - (posMap.get(b.id) ?? 9999));

  return {
    series: serie,
    current_post_id: postId,
    items: ordered,
  };
}
