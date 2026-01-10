import { apiFetch } from "../../lib/apiClient";

export type PostTag = {
  id: string;
  name: string;
  slug: string;
  // null = global
  section: "TECH" | "FASEC" | null;
};

export type PostDetail = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: any;
  reading_time: number;
  published_at: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;

  // ✅ nuevo
  tags: PostTag[];
};

export function fetchPostDetail(section: "TECH" | "FASEC", slug: string) {
  return apiFetch<PostDetail>(`/posts/${section}/${slug}`);
}
