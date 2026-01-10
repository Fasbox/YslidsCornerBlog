// src/features/posts/useRelatedPosts.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";

export type RelatedTag = {
  name: string;
  slug: string;
  section: "TECH" | "FASEC" | null;
};

export type RelatedPost = {
  id: string;
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  reading_time: number;
  published_at: string | null;
  tags: RelatedTag[];
};

export type RelatedPostsResponse = {
  items: RelatedPost[];
};

export function useRelatedPosts(section: "TECH" | "FASEC", slug: string, limit = 6) {
  return useQuery<RelatedPostsResponse>({
    queryKey: ["relatedPosts", section, slug, limit],
    queryFn: () => apiFetch(`/posts/${section}/${encodeURIComponent(slug)}/related?limit=${limit}`),
    enabled: Boolean(section) && Boolean(slug),
  });
}
