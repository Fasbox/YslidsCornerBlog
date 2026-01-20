import { useQuery } from "@tanstack/react-query";
import { fetchAdminTags, type AdminTagsListResponse } from "../features/admin/adminTags.api";

export function useAdminTags(section?: "TECH" | "FASEC") {
  return useQuery<AdminTagsListResponse>({
    queryKey: ["adminTags", section ?? "ALL"],
    queryFn: () => fetchAdminTags(section ? { section } : undefined),
  });
}
