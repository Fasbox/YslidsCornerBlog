import { apiFetch } from "../../lib/apiClient";

export type Tag = {
  id: string;
  section: "TECH" | "FASEC" | null;
  name: string;
  slug: string;
  created_at: string;
};

export type TagsListResponse = {
  items: Tag[];
};

export function fetchTags(params?: { section?: "TECH" | "FASEC" }) {
  const qs = new URLSearchParams();
  if (params?.section) qs.set("section", params.section);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<TagsListResponse>(`/tags${suffix}`);
}
