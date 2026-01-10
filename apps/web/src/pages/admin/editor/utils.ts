// src/pages/admin/editor/utils.ts
export function emptyDoc() {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function normalizeDoc(maybe: any) {
  if (!maybe || typeof maybe !== "object") return emptyDoc();
  if (maybe.type !== "doc") return emptyDoc();
  if (!Array.isArray(maybe.content)) return emptyDoc();
  return maybe;
}
