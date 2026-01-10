import { apiFetch } from "../../lib/apiClient";

export type PostTag = { id: string; name: string; slug: string; section: "TECH" | "FASEC" | null };

export type PostListItem = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  reading_time: number;
  published_at: string | null;
  cover_image_url: string | null;
  tags: PostTag[];
};

export type PostsListResponse = {
  page: number;
  limit: number;
  total: number;
  items: PostListItem[];
};

export function fetchPosts(params: {
  page: number;
  limit: number;
  section?: "TECH" | "FASEC";
  q?: string;
  tag?: string;
}) {
  const qs = new URLSearchParams();

  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));

  if (params.section) qs.set("section", params.section);
  if (params.q) qs.set("q", params.q);
  if (params.tag) qs.set("tag", params.tag);

  return apiFetch<PostsListResponse>(`/posts?${qs.toString()}`);
}