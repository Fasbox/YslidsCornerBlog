import { apiFetch } from "../../lib/apiClient";
import type { PostBase } from "./posts.types";

export type PostDetail = PostBase & {
  content_json: any;
  created_at: string;
  updated_at: string;
};

export function fetchPostDetail(section: "TECH" | "FASEC", slug: string) {
  return apiFetch<PostDetail>(`/posts/${section}/${slug}`);
}
