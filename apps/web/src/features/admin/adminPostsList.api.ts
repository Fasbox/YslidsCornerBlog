import { adminFetch } from "../../lib/apiAdminClient";

export type AdminTag = {
  id: string;
  section: "TECH" | "FASEC" | null;
  name: string;
  slug: string;
  created_at: string;
};

export type AdminPostListItem = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  updated_at: string;

  cover_image_url?: string | null;
  published_at?: string | null;

  series?: { id: string; title: string; slug: string } | null;
  tags?: AdminTag[];
};

export type AdminPostsListResponse = {
  items: AdminPostListItem[];
  page: number;
  limit: number;
  total: number;
};

export function fetchAdminPosts(params: {
  page: number;
  limit: number;
  section?: "TECH" | "FASEC";
  status?: "DRAFT" | "PUBLISHED";
  q?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", String(params.limit));
  if (params.section) sp.set("section", params.section);
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);

  return adminFetch<AdminPostsListResponse>(`/admin/posts?${sp.toString()}`);
}
