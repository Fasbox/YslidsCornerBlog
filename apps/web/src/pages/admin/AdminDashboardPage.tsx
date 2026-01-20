import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "../../components/Card";
import {
  fetchAdminPosts,
  type AdminPostsListResponse,
} from "../../features/admin/adminPostsList.api";
import { publishPost, unpublishPost } from "../../features/admin/adminPosts.api";

function safeDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;

  const [section, setSection] = useState<"" | "TECH" | "FASEC">("");
  const [status, setStatus] = useState<"" | "DRAFT" | "PUBLISHED">("");
  const [q, setQ] = useState("");

  const { data, isLoading, isError, error } = useQuery<AdminPostsListResponse>({
    queryKey: ["adminPosts", page, limit, section, status, q],
    queryFn: () =>
      fetchAdminPosts({
        page,
        limit,
        section: section || undefined,
        status: status || undefined,
        q: q.trim() || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const totalPages = useMemo(() => {
    const total = data?.total ?? 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [data?.total]);

  const publishMut = useMutation({
    mutationFn: (id: string) => publishPost(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminPosts"] });
    },
  });

  const unpublishMut = useMutation({
    mutationFn: (id: string) => unpublishPost(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminPosts"] });
    },
  });

  return (
    <div className="container">
      <div className="adminDash">
        <header className="adminDash__header">
          <div>
            <h1 className="adminDash__title">Admin</h1>
            <p className="adminDash__subtitle">
              Gestiona posts (draft/publicado), edita y publica.
            </p>
          </div>

          <button className="btn" onClick={() => nav("/admin/new")}>
            + Nuevo post
          </button>
          <button className="btn" onClick={() => nav("/admin/tags")}>Gestionar tags</button>
        </header>

        <Card>
          <div className="card-pad">
            <div className="adminDash__filters">
              <div>
                <label className="fieldLabel">Sección</label>
                <select
                  className="fieldControl"
                  value={section}
                  onChange={(e) => {
                    setPage(1);
                    setSection(e.target.value as "" | "TECH" | "FASEC");
                  }}
                >
                  <option value="">Todas</option>
                  <option value="TECH">TECH</option>
                  <option value="FASEC">FASEC</option>
                </select>
              </div>

              <div>
                <label className="fieldLabel">Estado</label>
                <select
                  className="fieldControl"
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value as "" | "DRAFT" | "PUBLISHED");
                  }}
                >
                  <option value="">Todos</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>

              <div className="adminDash__filtersSpan2">
                <label className="fieldLabel">Buscar</label>
                <input
                  className="fieldControl"
                  placeholder="Título, slug o excerpt…"
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-pad">
            {isLoading ? (
              <p className="adminDash__muted">Cargando…</p>
            ) : isError ? (
              <p className="adminDash__error">
                Error: {(error as Error).message}
              </p>
            ) : (
              <div className="adminDash__tableArea">
                <div className="adminDash__tableWrap">
                  <table className="adminDash__table">
                    <thead>
                      <tr>
                        <th>Post</th>
                        <th>Sección</th>
                        <th>Estado</th>
                        <th>Serie</th>
                        <th>Actualizado</th>
                        <th className="adminDash__thRight">Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(data?.items ?? []).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="adminDash__postCell">
                              {p.cover_image_url ? (
                                <img
                                  className="adminDash__coverMini"
                                  src={p.cover_image_url}
                                  alt=""
                                  loading="lazy"
                                />
                              ) : (
                                <div className="adminDash__coverMini adminDash__coverMini--empty" />
                              )}

                              <div className="adminDash__postText">
                                <button
                                  className="adminDash__titleBtn"
                                  onClick={() => nav(`/admin/editor/${p.id}`)}
                                >
                                  {p.title}
                                </button>
                                <div className="adminDash__subline">
                                  <span className="adminDash__slug">
                                    {p.slug}
                                  </span>
                                </div>
                                {p.tags?.length ? (
                                  <div className="adminDash__tagsRow">
                                    {p.tags.slice(0, 3).map((t) => (
                                      <span key={`${p.id}-${t.id}`} className="adminDash__tagChip">
                                        #{t.name}
                                      </span>
                                    ))}
                                    {p.tags.length > 3 ? (
                                      <span className="adminDash__tagMore">+{p.tags.length - 3}</span>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          <td className="adminDash__cellStrong">{p.section}</td>

                          <td>
                            <span
                              className={
                                p.status === "PUBLISHED"
                                  ? "adminDash__status adminDash__status--published"
                                  : "adminDash__status adminDash__status--draft"
                              }
                            >
                              {p.status}
                            </span>
                          </td>

                          <td>
                            {p.series?.title ? (
                              <span className="adminDash__seriesPill">
                                {p.series.title}
                              </span>
                            ) : (
                              <span className="adminDash__muted">—</span>
                            )}
                          </td>

                          <td className="adminDash__muted">
                            {safeDate(p.updated_at)}
                          </td>

                          <td>
                            <div className="adminDash__actions">
                              <button
                                className="btn btn--sm"
                                onClick={() => nav(`/admin/editor/${p.id}`)}
                              >
                                Editar
                              </button>

                              {p.status === "DRAFT" ? (
                                <button
                                  className="btn btn--sm btn--ok"
                                  disabled={publishMut.isPending}
                                  onClick={() => publishMut.mutate(p.id)}
                                >
                                  Publicar
                                </button>
                              ) : (
                                <button
                                  className="btn btn--sm btn--warn"
                                  disabled={unpublishMut.isPending}
                                  onClick={() => unpublishMut.mutate(p.id)}
                                >
                                  Despublicar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {data && data.items.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="adminDash__empty">
                            No hay resultados.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="adminDash__footer">
                  <p className="adminDash__muted">Total: {data?.total ?? 0}</p>

                  <div className="adminDash__pager">
                    <button
                      className="btn btn--sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      ←
                    </button>

                    <span className="adminDash__muted">
                      {page} / {totalPages}
                    </span>

                    <button
                      className="btn btn--sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
