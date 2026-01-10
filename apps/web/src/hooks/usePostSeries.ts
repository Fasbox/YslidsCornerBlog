// src/features/posts/usePostSeries.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";

export type SeriesMeta = {
  id: string;
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  description: string | null;
};

export type SeriesPostItem = {
  id: string;
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  reading_time: number;
  published_at: string | null;
};

export type PostSeriesResponse = {
  series: SeriesMeta | null;
  current_post_id?: string;
  items: SeriesPostItem[];
};

export function usePostSeries(section: "TECH" | "FASEC", slug: string, limit = 12) {
  return useQuery<PostSeriesResponse>({
    queryKey: ["postSeries", section, slug, limit],
    queryFn: () => apiFetch(`/posts/${section}/${encodeURIComponent(slug)}/series?limit=${limit}`),
    enabled: Boolean(section) && Boolean(slug),
  });
}
