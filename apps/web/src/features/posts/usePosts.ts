import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PostsListResponse } from "./posts.api";
import { fetchPosts } from "./posts.api";

export type UsePostsParams = {
  page: number;
  limit: number;
  section?: "TECH" | "FASEC";
  q?: string;
  tag?: string;
};

export function usePosts(params: UsePostsParams) {
  const { section, page, limit, q, tag } = params;

  return useQuery<PostsListResponse>({
    queryKey: ["posts", { section, page, limit, q, tag }],
    queryFn: () => fetchPosts({ section, page, limit, q, tag }),
    placeholderData: keepPreviousData,
  });
}
