import { adminFetch } from "../../lib/apiAdminClient";

export function updatePostTags(postId: string, tagIds: string[]) {
  return adminFetch(`/admin/posts/${postId}/tags`, {
    method: "PUT",
    body: JSON.stringify({ tag_ids: tagIds }),
  });
}
