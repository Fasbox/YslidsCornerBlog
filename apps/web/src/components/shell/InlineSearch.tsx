import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInlinePostsSearch } from "../../features/posts/useInlinePostsSearch";

function basePath(section: "TECH" | "FASEC") {
  return section === "FASEC" ? "/fasec" : "/tech";
}

type Props = {
  section?: "TECH" | "FASEC"; // opcional: si quieres limitar por sección
  placeholder?: string;
  onPick?: () => void; // para cerrar drawer cuando eligen un resultado
  className?: string;
};

export default function InlineSearch({ section, placeholder, onPick, className }: Props) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);

  const q = value.trim();
  const search = useInlinePostsSearch({ q, section });

  // abrir/cerrar según input
  useEffect(() => {
    if (q.length >= 2) setOpen(true);
    else setOpen(false);
  }, [q]);

  // cerrar click afuera
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const items = search.items;

  return (
    <div className={["inlineSearch", className ?? ""].join(" ")} ref={ref}>
      <input
        className="inlineSearch__input"
        placeholder={placeholder ?? "Buscar posts…"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => q.length >= 2 && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);

          if (e.key === "Enter") {
            // Si hay resultados, abre el primero
            if (items[0]) {
              const p = items[0];
              nav(`${basePath(p.section)}/post/${p.slug}`);
              setOpen(false);
              onPick?.();
              return;
            }
            // fallback a SearchPage
            nav(`/search?q=${encodeURIComponent(q)}${section ? `&section=${section}` : ""}&page=1`);
            setOpen(false);
            onPick?.();
          }
        }}
      />

      {open ? (
        <div className="inlineSearch__panel">
          {search.isFetching ? <div className="inlineSearch__hint">Buscando…</div> : null}
          {search.isError ? <div className="inlineSearch__hint">Error buscando</div> : null}

          {!search.isFetching && items.length === 0 ? (
            <div className="inlineSearch__hint">Sin resultados</div>
          ) : null}

          {items.map((p) => (
            <Link
              key={p.id}
              className="inlineSearch__item"
              to={`${basePath(p.section)}/post/${p.slug}`}
              onClick={() => {
                setOpen(false);
                onPick?.();
              }}
            >
              <div className="inlineSearch__thumb">
                {p.cover_image_url ? (
                  <img
                    src={p.cover_image_url}
                    alt=""
                    loading="lazy"
                    className="inlineSearch__thumbImg"
                  />
                ) : (
                  <div className="inlineSearch__thumbPh" aria-hidden="true" />
                )}
              </div>

              <div className="inlineSearch__text">
                <div className="inlineSearch__title">{p.title}</div>
                {p.excerpt ? <div className="inlineSearch__excerpt">{p.excerpt}</div> : null}
              </div>
            </Link>
          ))}

          {q.length >= 2 ? (
            <Link
              className="inlineSearch__more"
              to={`/search?q=${encodeURIComponent(q)}${section ? `&section=${section}` : ""}&page=1`}
              onClick={() => {
                setOpen(false);
                onPick?.();
              }}
            >
              Ver todos →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
