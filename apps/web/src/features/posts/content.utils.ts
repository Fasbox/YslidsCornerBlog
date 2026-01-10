export function extractPlainText(doc: any): string {
  if (!doc || typeof doc !== "object") return "";
  const out: string[] = [];

  const walk = (node: any) => {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (node.type === "text" && typeof node.text === "string") out.push(node.text);
    if (node.content) walk(node.content);
  };

  walk(doc);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export function estimateReadingTimeMinutes(text: string): number {
  // Aproximación MVP: 200 palabras/min
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}
