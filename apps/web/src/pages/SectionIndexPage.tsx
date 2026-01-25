import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { usePosts } from "../features/posts/usePosts";

type Props = { section: "TECH" | "FASEC" };

function label(section: "TECH" | "FASEC") {
  return section === "FASEC" ? "FASEC" : "Tech";
}

function basePath(section: "TECH" | "FASEC") {
  return section === "FASEC" ? "/fasec" : "/tech";
}

export default function SectionIndexPage({ section }: Props) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = usePosts({
    section,
    page,
    limit,
  });

  const totalPages = useMemo(() => {
    const total = data?.total ?? 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [data?.total, limit]);

  const items = data?.items ?? [];
  const empty = !isLoading && !isError && items.length === 0;

  return (
    <div className="section">
      <header className="section__header">
        <div className="section__kickerRow">
          <p className="section__kicker">SECCIÓN</p>
          {isFetching ? <span className="section__fetching">Actualizando…</span> : null}
        </div>

        <h1 className="section__title">{label(section)}</h1>

        <p className="section__subtitle">
          Explora artículos y recursos sobre {label(section).toLowerCase()}.
        </p>
      </header>

      {isLoading ? (
        <Card>
          <p className="muted">Cargando posts…</p>
        </Card>
      ) : isError ? (
        <Card>
          <p className="errorText">Error: {(error as Error).message}</p>
        </Card>
      ) : empty ? (
        <Card>
          <p className="muted">No hay posts publicados aún para esta sección.</p>
        </Card>
      ) : (
        <>
          <div className="section__list">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`${basePath(section)}/post/${p.slug}`}
                className="postCard"
              >
                {/* Cover opcional */}
                {p.cover_image_url ? (
                  <div className="postCard__coverWrap">
                    <img
                      src={p.cover_image_url}
                      alt=""
                      loading="lazy"
                      className="postCard__cover"
                    />
                  </div>
                ) : null}

                <div className="postCard__body">
                  <div className="postCard__topRow">
                    <h2 className="postCard__title">{p.title}</h2>

                    <div className="postCard__meta">
                      <span className="pill">{p.reading_time} min</span>
                      {p.published_at ? (
                        <span className="pill">
                          {new Date(p.published_at).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {p.excerpt ? <p className="postCard__excerpt">{p.excerpt}</p> : null}

                  {/* Tags (si vienen) */}
                  {p.tags?.length ? (
                    <div className="postCard__tags" aria-label="Tags">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={`${p.id}-${t.slug}`} className="tagChip">
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="postCard__ctaRow">
                    <span className="postCard__cta">Leer →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="section__pager">
            <div className="section__pagerInfo">
              <p className="muted">
                Página {page} de {totalPages} · Total: {data?.total ?? 0}
              </p>
            </div>

            <div className="section__pagerBtns">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn--ghost"
              >
                ← Anterior
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn--primary"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
