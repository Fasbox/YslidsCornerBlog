import { usePosts } from "./usePosts";
import { useDebouncedValue } from "../../utils/useDebouncedValue";

export function useInlinePostsSearch(input: {
  q: string;
  section?: "TECH" | "FASEC";
}) {
  const qTrim = input.q.trim();
  const qDebounced = useDebouncedValue(qTrim, 300);

  const enabled = qDebounced.length >= 3;

  const query = usePosts({
    page: 1,
    limit: 6,
    section: input.section,
    q: enabled ? qDebounced : undefined,
    tag: undefined,
  });

  return {
    ...query,
    enabled,
    q: qDebounced,
    items: enabled ? (query.data?.items ?? []) : [],
    total: enabled ? (query.data?.total ?? 0) : 0,
  };
}
