import { adminFetch } from "../../lib/apiAdminClient";

export function getAdminPostSeries(postId: string) {
  return adminFetch<{ series_id: string | null }>(`/admin/posts/${postId}/series`);
}

export function setAdminPostSeries(postId: string, seriesId: string | null) {
  return adminFetch<{ ok: true; post_id: string; series_id: string | null }>(
    `/admin/posts/${postId}/series`,
    {
      method: "PUT",
      body: JSON.stringify({ series_id: seriesId }),
    }
  );
}
