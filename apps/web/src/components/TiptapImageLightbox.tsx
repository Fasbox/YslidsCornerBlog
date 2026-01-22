import { useEffect } from "react";

type Props = {
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function TiptapImageLightbox({ src, alt, onClose }: Props) {
  // cerrar con ESC + bloquear scroll
  useEffect(() => {
    document.body.classList.add("tiptapLightboxOpen");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("tiptapLightboxOpen");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="tiptapLightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="tiptapLightbox__close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>

      <div className="tiptapLightbox__inner" onClick={(e) => e.stopPropagation()}>
        <img className="tiptapLightbox__img" src={src} alt={alt ?? ""} onClick={onClose} />
        <div className="tiptapLightbox__hint">Toca afuera o presiona ESC para cerrar</div>
      </div>
    </div>
  );
}
