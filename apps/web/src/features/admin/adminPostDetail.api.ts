import { adminFetch } from "../../lib/apiAdminClient";

export type AdminTag = {
  id: string;
  name: string;
  slug: string;
  section: "TECH" | "FASEC" | null;
};

export type AdminPostDetail = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: any;
  content_text: string;
  reading_time: number;
  published_at: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  tags: AdminTag[];
};

export function getAdminPost(id: string) {
  return adminFetch<AdminPostDetail>(`/admin/posts/${id}`);
}

export function updateAdminPost(id: string, input: Partial<AdminPostDetail>) {
  return adminFetch(`/admin/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export type PublicPostDetail = {
  id: string;
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  excerpt: string | null;
  reading_time: number;
  published_at: string | null;
  content_json: any; // o JSONContent si lo importas
  content_text: string | null;
};
