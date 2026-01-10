import { adminFetch } from "../../lib/apiAdminClient";

/* ---------- TYPES ---------- */

export type AdminPost = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;

  // ya lo traes en backend (listAdminPosts select)
  cover_image_url?: string | null;
  published_at?: string | null;

  // NUEVO: para columna "Serie"
  series?: { id: string; title: string; slug: string } | null;

  updated_at: string;
};


export type AdminPostsListResponse = {
  items: AdminPost[];
  page: number;
  limit: number;
  total: number;
};

export type AdminPostCreateResponse = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
};

/* ---------- LIST ---------- */

export function fetchAdminPosts(params: {
  page: number;
  limit: number;
  section?: "TECH" | "FASEC";
  status?: "DRAFT" | "PUBLISHED";
  q?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));
  if (params.section) qs.set("section", params.section);
  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);

  return adminFetch<AdminPostsListResponse>(`/admin/posts?${qs.toString()}`);
}

/* ---------- MUTATIONS ---------- */

export function createPost(input: {
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  excerpt?: string;
}) {
  return adminFetch<AdminPostCreateResponse>("/admin/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function publishPost(id: string) {
  return adminFetch(`/admin/posts/${id}/publish`, { method: "POST" });
}

export function unpublishPost(id: string) {
  return adminFetch(`/admin/posts/${id}/unpublish`, { method: "POST" });
}
