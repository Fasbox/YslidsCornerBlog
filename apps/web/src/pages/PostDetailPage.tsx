import { Link, useParams } from "react-router-dom";
import Card from "../components/Card";
import { usePostDetail } from "../features/posts/usePostDetail";
import PostContent from "../components/PostContent";
import RelatedPosts from "./RelatedPosts";
import "../styles/components/relatedPosts.css";

type RouteParams = {
  slug?: string;
};

function sectionFromPath(pathname: string): "TECH" | "FASEC" {
  return pathname.startsWith("/fasec") ? "FASEC" : "TECH";
}

export default function PostDetailPage() {
  const { slug } = useParams<RouteParams>();
  const section = sectionFromPath(window.location.pathname);
  const backTo = section === "FASEC" ? "/fasec" : "/tech";

  const { data, isLoading, isError, error } = usePostDetail(section, slug ?? "");

  return (
    <div className="postDetail">
      {/* ✅ Volver siempre arriba, no depende del post */}
      <div className="postDetail__topBar">
        <Link to={backTo} className="postDetail__back btn btn--ghost">
          ← Volver
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <p className="muted">Cargando…</p>
        </Card>
      ) : isError ? (
        <Card>
          <p className="errorText">Error: {(error as Error).message}</p>
        </Card>
      ) : !data ? (
        <Card>
          <p className="muted">Post no encontrado.</p>
        </Card>
      ) : (
        <div className="postDetail__layout">
          {/* MAIN */}
          <article className="postDetail__article">
            <header className="postDetail__header">
              {data.cover_image_url ? (
                <div className="postDetail__coverWrap">
                  <img
                    src={data.cover_image_url}
                    alt=""
                    className="postDetail__cover"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <h1 className="postDetail__title">{data.title}</h1>

              <div className="postDetail__meta">
                <span className="pill">{data.reading_time} min</span>
                {data.published_at ? (
                  <span className="pill">
                    {new Date(data.published_at).toLocaleDateString()}
                  </span>
                ) : null}
              </div>

              {data.tags?.length ? (
                <div className="postDetail__tags">
                  {data.tags.map((t) => (
                    <Link
                      key={t.id ?? t.slug}
                      to={`/search?tag=${encodeURIComponent(t.slug)}&section=${encodeURIComponent(
                        section
                      )}`}
                      className="tagChip"
                      title={`Buscar: ${t.name}`}
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              ) : null}

              {data.excerpt ? (
                <p className="postDetail__excerpt">{data.excerpt}</p>
              ) : null}
            </header>

            <Card>
              {data.content_json ? (
                <PostContent content={data.content_json} />
              ) : (
                <p className="muted">Sin contenido.</p>
              )}
            </Card>
          </article>

          {/* SIDEBAR */}
          <aside className="postDetail__aside">
            <RelatedPosts section={section} slug={slug ?? ""} />
          </aside>
        </div>
      )}
    </div>
  );
}
