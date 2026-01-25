import { apiFetch } from "../../lib/apiClient";
import type { PostBase } from "./posts.types";

export type PostListItem = PostBase;

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

export function fetchLatestPosts(limit = 4) {
  return fetchPosts({ page: 1, limit });
}
