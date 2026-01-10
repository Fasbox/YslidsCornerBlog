import { useQuery } from "@tanstack/react-query";
import { fetchTags, type TagsListResponse } from "./tags.api";

export function useTags(section?: "TECH" | "FASEC") {
  return useQuery<TagsListResponse>({
    queryKey: ["tags", section ?? "ALL"],
    queryFn: () => fetchTags(section ? { section } : undefined),
  });
}
