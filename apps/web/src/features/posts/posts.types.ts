// web/src/features/posts/posts.types.ts

export type PostSection = "TECH" | "FASEC";

export type PostTag = {
  id: string;
  name: string;
  slug: string;
  // null = tag global
  section: PostSection | null;
};

export type PostBase = {
  id: string;
  section: PostSection;
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  reading_time: number;
  published_at: string | null;
  cover_image_url: string | null;
  tags: PostTag[];
};
