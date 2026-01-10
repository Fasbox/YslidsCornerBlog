import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useRelatedPosts } from "../hooks/useRelatedPosts";
import { usePostSeries } from "../hooks/usePostSeries";

type Props = {
  section: "TECH" | "FASEC";
  slug: string;
  currentPostId?: string; // opcional si quieres resaltar por id en futuro
};

function basePath(section: "TECH" | "FASEC") {
  return section === "FASEC" ? "/fasec" : "/tech";
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function RelatedPosts({ section, slug }: Props) {
  const relatedQ = useRelatedPosts(section, slug, 6);
  const seriesQ = usePostSeries(section, slug, 12);

  const base = basePath(section);

  return (
    <aside className="related">
      {/* ====== SERIE ====== */}
      <Card>
        <div className="related__block">
          <div className="related__head">
            <p className="related__kicker">SERIE</p>
            <h3 className="related__title">En esta serie</h3>
          </div>

          {seriesQ.isLoading ? (
            <p className="related__muted">Cargando serie…</p>
          ) : seriesQ.isError ? (
            <p className="related__error">No se pudo cargar la serie.</p>
          ) : !seriesQ.data?.series || (seriesQ.data.items?.length ?? 0) === 0 ? (
            <p className="related__muted">Este post no pertenece a una serie.</p>
          ) : (
            <>
              <p className="related__seriesName">{seriesQ.data.series.title}</p>
              {seriesQ.data.series.description ? (
                <p className="related__seriesDesc">{seriesQ.data.series.description}</p>
              ) : null}

              <div className="related__list">
                {seriesQ.data.items.map((p) => (
                  <Link key={p.id} to={`${base}/post/${p.slug}`} className="related__item">
                    <div className="related__itemTitle">{p.title}</div>
                    <div className="related__itemMeta">
                      <span>{p.reading_time} min</span>
                      {p.published_at ? <span>· {formatDate(p.published_at)}</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* ====== RELACIONADOS ====== */}
      <Card>
        <div className="related__block">
          <div className="related__head">
            <p className="related__kicker">RELACIONADOS</p>
            <h3 className="related__title">Sigue con esto</h3>
          </div>

          {relatedQ.isLoading ? (
            <p className="related__muted">Buscando posts relacionados…</p>
          ) : relatedQ.isError ? (
            <p className="related__error">No se pudieron cargar relacionados.</p>
          ) : (relatedQ.data?.items?.length ?? 0) === 0 ? (
            <p className="related__muted">Aún no hay relacionados para este post.</p>
          ) : (
            <div className="related__list">
              {relatedQ.data!.items.map((p) => (
                <Link key={p.id} to={`${base}/post/${p.slug}`} className="related__item">
                  <div className="related__itemTitle">{p.title}</div>
                  <div className="related__itemMeta">
                    <span>{p.reading_time} min</span>
                    {p.published_at ? <span>· {formatDate(p.published_at)}</span> : null}
                  </div>

                  {p.tags?.length ? (
                    <div className="related__chips">
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={`${p.id}-${t.slug}`} className="related__chip">
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
}
