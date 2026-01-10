import { useQuery } from "@tanstack/react-query";
import { fetchPostDetail } from "./postDetail.api";

export function usePostDetail(section: "TECH" | "FASEC", slug: string) {
  return useQuery({
    queryKey: ["post", section, slug],
    queryFn: () => fetchPostDetail(section, slug),
    enabled: Boolean(section && slug)
  });
}
