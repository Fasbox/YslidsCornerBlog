import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import { usePosts } from "../features/posts/usePosts";
import { useTags } from "../features/tags/useTags";
import { useDebouncedValue } from "../utils/useDebouncedValue";

import "../styles/components/search.css";

function basePath(section: "TECH" | "FASEC") {
  return section === "FASEC" ? "/fasec" : "/tech";
}

type SectionFilter = "" | "TECH" | "FASEC";

export default function SearchPage() {
  const [sp, setSp] = useSearchParams();

  // 1) leer desde URL
  const sectionParam = (sp.get("section") ?? "") as SectionFilter;
  const tagParam = sp.get("tag") ?? "";
  const qParam = sp.get("q") ?? "";
  const pageParam = Number(sp.get("page") ?? "1") || 1;

  // 2) estado local (UI)
  const [section, setSection] = useState<SectionFilter>(sectionParam);
  const [tag, setTag] = useState(tagParam);

  // qInput = lo que escribe el usuario
  const [qInput, setQInput] = useState(qParam);
  // appliedQ = lo que realmente se usa para consultar / URL (debounced o botón Buscar)
  const [appliedQ, setAppliedQ] = useState(qParam);

  const [page, setPage] = useState(pageParam);
  const limit = 9; // ✅ grid 3 cols en desktop

  // 3) debounce solo para texto
  const debouncedQ = useDebouncedValue(qInput, 1000);

  // 4) tags según sección (global + sección, o todos)
  const tagsQ = useTags(section ? (section as "TECH" | "FASEC") : undefined);

  // 5) sincronizar estado cuando cambia la URL (back/forward o links)
  useEffect(() => {
    setSection(sectionParam);
    setTag(tagParam);
    setQInput(qParam);
    setAppliedQ(qParam);
    setPage(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionParam, tagParam, qParam, pageParam]);

  // helper escribir URL
  function pushToUrl(next: { section?: SectionFilter; tag?: string; q?: string; page?: number }) {
    const nextSp = new URLSearchParams(sp);

    const nextSection = next.section ?? section;
    const nextTag = next.tag ?? tag;
    const nextQ = next.q ?? appliedQ;
    const nextPage = next.page ?? 1;

    if (nextSection) nextSp.set("section", nextSection);
    else nextSp.delete("section");

    if (nextTag) nextSp.set("tag", nextTag);
    else nextSp.delete("tag");

    const qTrim = (nextQ ?? "").trim();
    if (qTrim) nextSp.set("q", qTrim);
    else nextSp.delete("q");

    nextSp.set("page", String(nextPage));
    setSp(nextSp, { replace: true });
  }

  // 6) Aplicar debounce al texto (y regla: mínimo 4 caracteres)
  const firstDebounceRun = useRef(true);
  useEffect(() => {
    if (firstDebounceRun.current) {
      firstDebounceRun.current = false;
      return;
    }

    const trimmed = debouncedQ.trim();
    const nextApplied = trimmed.length >= 4 ? trimmed : "";

    // evita loops si no cambió lo aplicado
    if (nextApplied === (appliedQ ?? "").trim()) return;

    setAppliedQ(nextApplied);
    setPage(1);
    pushToUrl({ q: nextApplied, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // Buscar inmediato (sin esperar debounce)
  function forceSearchNow() {
    const trimmed = qInput.trim();
    const nextApplied = trimmed.length >= 2 ? trimmed : "";
    setAppliedQ(nextApplied);
    setPage(1);
    pushToUrl({ q: nextApplied, page: 1 });
  }

  // 7) query posts (usa appliedQ, no qInput)
  const postsQ = usePosts({
    page,
    limit,
    section: section ? (section as "TECH" | "FASEC") : undefined,
    q: appliedQ.trim() ? appliedQ.trim() : undefined,
    tag: tag ? tag : undefined,
  });

  const totalPages = useMemo(() => {
    const total = postsQ.data?.total ?? 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [postsQ.data?.total, limit]);

  // 8) tags para select (ordenadas)
  const tagsForSelect = useMemo(() => {
    const items = tagsQ.data?.items ?? [];
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [tagsQ.data]);

  const items = postsQ.data?.items ?? [];

  return (
    <div className="search">
      <header className="search__header">
        <h1 className="search__title">Buscar</h1>
        <p className="search__subtitle">Filtra por sección, tag y texto (título, excerpt, contenido).</p>
      </header>

      <Card>
        <div className="search__filters">
          <div>
            <label className="fieldLabel">Sección</label>
            <select
              className="fieldControl"
              value={section}
              onChange={(e) => {
                const nextSection = e.target.value as SectionFilter;
                setSection(nextSection);
                setTag("");
                setPage(1);
                pushToUrl({ section: nextSection, tag: "", page: 1 });
              }}
            >
              <option value="">Todas</option>
              <option value="TECH">TECH</option>
              <option value="FASEC">FASEC</option>
            </select>
          </div>

          <div>
            <label className="fieldLabel">Tag</label>
            <select
              className="fieldControl"
              value={tag}
              onChange={(e) => {
                const nextTag = e.target.value;
                setTag(nextTag);
                setPage(1);
                pushToUrl({ tag: nextTag, page: 1 });
              }}
              disabled={tagsQ.isLoading || tagsQ.isError}
            >
              <option value="">Todos</option>
              {tagsForSelect.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                  {t.section ? ` (${t.section})` : ""}
                </option>
              ))}
            </select>

            {tagsQ.isError ? <p className="search__inlineError">Error cargando tags.</p> : null}
          </div>

          <div className="search__q">
            <label className="fieldLabel">Texto</label>
            <input
              className="fieldControl"
              placeholder="Buscar por título, excerpt o contenido…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  forceSearchNow();
                }
              }}
            />
          </div>

          <div className="search__actions">
            <button className="btn btn--primary" type="button" onClick={forceSearchNow}>
              Buscar
            </button>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => {
                setSection("");
                setTag("");
                setQInput("");
                setAppliedQ("");
                setPage(1);
                setSp(new URLSearchParams({ page: "1" }), { replace: true });
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      </Card>

      <Card>
        {postsQ.isLoading ? (
          <p className="muted">Cargando…</p>
        ) : postsQ.isError ? (
          <p className="errorText">Error: {(postsQ.error as Error).message}</p>
        ) : (
          <>
            <div className="search__list">
              {items.map((p) => (
                <Link key={p.id} to={`${basePath(p.section)}/post/${p.slug}`} className="searchCard">
                  {p.cover_image_url ? (
                    <div className="searchCard__coverWrap">
                      <img src={p.cover_image_url} alt="" className="searchCard__cover" loading="lazy" />
                    </div>
                  ) : null}

                  <div className="searchCard__body">
                    <div className="searchCard__topRow">
                      <h2 className="searchCard__title">{p.title}</h2>

                      <div className="searchCard__meta">
                        <span className="pill">{p.section}</span>
                        <span className="pill">{p.reading_time} min</span>
                      </div>
                    </div>

                    {p.excerpt ? <p className="searchCard__excerpt">{p.excerpt}</p> : null}

                    {p.tags?.length ? (
                      <div className="searchCard__tags" aria-label="Tags">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={`${p.id}-${t.slug}`} className="tagChip">
                            #{t.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="searchCard__ctaRow">
                      <span className="searchCard__cta">Abrir →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {items.length === 0 ? <p className="search__empty">No hay resultados.</p> : null}

            <div className="search__pager">
              <div className="search__pagerInfo">
                <p className="muted">Total: {postsQ.data?.total ?? 0}</p>
              </div>

              <div className="search__pagerBtns">
                <button
                  className="btn btn--ghost"
                  disabled={page <= 1}
                  onClick={() => {
                    const next = Math.max(1, page - 1);
                    setPage(next);
                    pushToUrl({ page: next });
                  }}
                >
                  ← Anterior
                </button>

                <span className="search__pagerCount">
                  {page} / {totalPages}
                </span>

                <button
                  className="btn btn--primary"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const next = Math.min(totalPages, page + 1);
                    setPage(next);
                    pushToUrl({ page: next });
                  }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
