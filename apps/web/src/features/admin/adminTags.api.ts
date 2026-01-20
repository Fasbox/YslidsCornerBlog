import { adminFetch } from "../../lib/apiAdminClient";
import type { Tag } from "../tags/tags.api";

export type AdminTagsListResponse = { items: Tag[] };

export function fetchAdminTags(params?: { section?: "TECH" | "FASEC" }) {
  const qs = new URLSearchParams();
  if (params?.section) qs.set("section", params.section);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return adminFetch<AdminTagsListResponse>(`/admin/tags${suffix}`);
}

// ---- CREATE ----

export type CreateAdminTagInput = {
  name: string;
  slug: string;
  section: "TECH" | "FASEC" | null; // null = GLOBAL
};

export type CreateAdminTagResponse = {
  item: Tag;
};

export function createAdminTag(input: CreateAdminTagInput) {
  return adminFetch<CreateAdminTagResponse>(`/admin/tags`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ---- UPDATE ----

export type UpdateAdminTagPatch = Partial<{
  name: string;
  slug: string;
  section: "TECH" | "FASEC" | null; // null = GLOBAL
}>;

export type UpdateAdminTagResponse = {
  item: Tag;
};

export function updateAdminTag(id: string, patch: UpdateAdminTagPatch) {
  return adminFetch<UpdateAdminTagResponse>(`/admin/tags/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

// ---- DELETE ----

export type DeleteAdminTagResponse = {
  ok: true;
};

export function deleteAdminTag(id: string) {
  return adminFetch<DeleteAdminTagResponse>(`/admin/tags/${id}`, {
    method: "DELETE",
  });
}

// Alias útil (opcional) para el componente
export type AdminTag = Tag;
