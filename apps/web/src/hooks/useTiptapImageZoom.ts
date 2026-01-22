import { useCallback, useEffect, useState } from "react";

export function useTiptapImageZoom(containerSelector = ".tiptap-content") {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [openAlt, setOpenAlt] = useState<string>("");

  const close = useCallback(() => setOpenSrc(null), []);

  useEffect(() => {
    const root = document.querySelector(containerSelector);
    if (!root) return;

    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const img = target?.closest("img") as HTMLImageElement | null;
      if (!img) return;

      // solo zoom a imágenes dentro del contenido
      if (!root.contains(img)) return;

      setOpenSrc(img.currentSrc || img.src);
      setOpenAlt(img.alt || "");
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [containerSelector]);

  return { openSrc, openAlt, close };
}
