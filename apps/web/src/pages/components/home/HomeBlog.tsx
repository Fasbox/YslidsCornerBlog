// src/components/home/HomeBlog.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "../../../styles/components/home/blog.css";
import { fetchPosts, type PostListItem } from "../../../features/posts/posts.api";

function SectionPill({ type }: { type: "TECH" | "FASEC" }) {
  return <span className={`postTag postTag--${type.toLowerCase()}`}>{type}</span>;
}

function toPostUrl(p: Pick<PostListItem, "section" | "slug">) {
  // ✅ Asumo que tus rutas públicas son /tech/:slug y /fasec/:slug
  return p.section === "FASEC" ? `/fasec/post/${p.slug}` : `/tech/post/${p.slug}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

function minutesLabel(n: number | null | undefined) {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return `${v} min`;
}

export default function HomeBlog() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-latest-posts"],
    queryFn: () =>
      fetchPosts({
        page: 1,
        limit: 4, // 1 destacado + 3 compactos
      }),
    staleTime: 60_000,
  });

  const items = data?.items ?? [];
  const featured = items[0] ?? null;
  const list = items.slice(1);

  return (
    <section className="blog">
      <div className="blogHead">
        <span className="sectionPill">Últimos artículos</span>

        <div className="blogHeadRow">
          <h2 className="blogTitle">
            Lo fresco del <span className="blogTitle__accent">blog</span>
          </h2>

          <Link className="blogAll" to="/search?q=">
            Ver todos los artículos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Estados */}
      {isLoading ? (
        <div className="blogGrid">
          <article className="featured" aria-busy="true">
            <div className="featuredMeta">
              <span className="metaText">Cargando…</span>
            </div>
            <h3 className="featuredTitle">Cargando últimos posts…</h3>
            <p className="featuredExcerpt">Un momento.</p>
            <span className="featuredLink">—</span>
          </article>

          <div className="compactCol" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="compact">
                <div className="compactMeta">
                  <span className="metaText">Cargando…</span>
                </div>
                <h4 className="compactTitle">…</h4>
                <p className="compactExcerpt">…</p>
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="blogGrid">
          <article className="featured">
            <div className="featuredMeta">
              <span className="metaText">Ups</span>
            </div>
            <h3 className="featuredTitle">No pude cargar los posts</h3>
            <p className="featuredExcerpt">
              Revisa tu <code>VITE_API_URL</code> o que el worker esté respondiendo.
            </p>
            <Link className="featuredLink" to="/search?q=">
              Ver todos <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      ) : featured ? (
        <div className="blogGrid">
          <article className="featured">
            <div className="featuredMeta">
              <SectionPill type={featured.section} />
              <span className="dot">•</span>
              <span className="metaText">{minutesLabel(featured.reading_time)}</span>
              {featured.published_at ? (
                <>
                  <span className="dot">•</span>
                  <span className="metaText">{formatDate(featured.published_at)}</span>
                </>
              ) : null}
            </div>

            <h3 className="featuredTitle">{featured.title}</h3>
            <p className="featuredExcerpt">{featured.excerpt ?? "—"}</p>

            <Link className="featuredLink" to={toPostUrl(featured)}>
              Leer artículo <span aria-hidden="true">→</span> 
            </Link>
          </article>

          <div className="compactCol">
            {list.map((p) => (
              <Link key={p.id} to={toPostUrl(p)} className="compact">
                <div className="compactMeta">
                  <SectionPill type={p.section} />
                  <span className="metaText">{minutesLabel(p.reading_time)}</span>
                </div>

                <h4 className="compactTitle">{p.title}</h4>
                <p className="compactExcerpt">{p.excerpt ?? "—"}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="blogGrid">
          <article className="featured">
            <div className="featuredMeta">
              <span className="metaText">Aún no hay posts</span>
            </div>
            <h3 className="featuredTitle">Todavía no has publicado artículos</h3>
            <p className="featuredExcerpt">Cuando publiques, aquí aparecerán automáticamente.</p>
            <Link className="featuredLink" to="/search?q=">
              Ver todos <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      )}
    </section>
  );
}
