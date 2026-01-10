import { adminFetch } from "../../lib/apiAdminClient";

export type AdminSeries = {
  id: string;
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  description: string | null;
};

export function fetchAdminSeries(params: { section: "TECH" | "FASEC" }) {
  const qs = new URLSearchParams();
  qs.set("section", params.section);
  return adminFetch<{ items: AdminSeries[] }>(`/admin/series?${qs.toString()}`);
}

export function createAdminSeries(input: {
  section: "TECH" | "FASEC";
  title: string;
  slug: string;
  description?: string | null;
}) {
  return adminFetch<AdminSeries>("/admin/series", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
