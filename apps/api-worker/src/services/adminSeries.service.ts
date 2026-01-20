// src/services/adminSeries.service.ts
import type { Env } from "../config/supabase";
import type { PostSection } from "../repositories/posts.repo";
import * as adminSeriesRepo from "../repositories/admin.series.repo";

export async function listSeries(env: Env, section: PostSection) {
  const items = await adminSeriesRepo.listSeries(env, section);
  return { items };
}

export async function createSeries(env: Env, input: { section: PostSection; title: string; slug: string; description?: string | null }) {
  return adminSeriesRepo.createSeries(env, input);
}

export async function getPostSeries(env: Env, postId: string) {
  const series_id = await adminSeriesRepo.getPostSeriesId(env, postId);
  return { series_id };
}

export async function setPostSeries(env: Env, postId: string, seriesId: string | null) {
  return adminSeriesRepo.setPostSeries(env, postId, seriesId);
}
