// src/pages/admin/AdminTagsPage.tsx
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "../../components/Card";
import { useAdminTags } from "../../hooks/useAdminTags";
import {
  createAdminTag,
  deleteAdminTag,
  updateAdminTag,
  type AdminTag,
} from "../../features/admin/adminTags.api";

import "../../styles/components/adminTags.css";

type Section = "TECH" | "FASEC";
type SectionFilter = "" | Section; // para filtrar
type SectionValue = Section | "GLOBAL"; // para editar/crear

function toSectionDb(v: SectionValue): Section | null {
  return v === "GLOBAL" ? null : v;
}

function fromSectionDb(v: Section | null): SectionValue {
  return v ?? "GLOBAL";
}

function slugifyLite(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminTagsPage() {
  const qc = useQueryClient();

  // filtro de lista
  const [section, setSection] = useState<SectionFilter>("");
  const tagsQ = useAdminTags(section ? (section as Section) : undefined);

  // búsqueda local
  const [q, setQ] = useState("");

  // crear
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newSection, setNewSection] = useState<SectionValue>("GLOBAL");

  // editar inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSection, setEditSection] = useState<SectionValue>("GLOBAL");

  const createMut = useMutation({
    mutationFn: (input: { name: string; slug: string; section: Section | null }) => createAdminTag(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminTags"] });
      setNewName("");
      setNewSlug("");
      setNewSection("GLOBAL");
    },
  });

  const updateMut = useMutation({
    mutationFn: (input: { id: string; patch: Partial<{ name: string; slug: string; section: Section | null }> }) =>
      updateAdminTag(input.id, input.patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminTags"] });
      setEditingId(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteAdminTag(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminTags"] });
    },
  });

  const items = tagsQ.data?.items ?? [];

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((t) => {
      return (
        t.name.toLowerCase().includes(qq) ||
        t.slug.toLowerCase().includes(qq) ||
        (t.section ?? "GLOBAL").toLowerCase().includes(qq)
      );
    });
  }, [items, q]);

  function startEdit(t: AdminTag) {
    setEditingId(t.id);
    setEditName(t.name);
    setEditSlug(t.slug);
    setEditSection(fromSectionDb(t.section));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function onCreate() {
    const name = newName.trim();
    const slug = (newSlug.trim() || slugifyLite(name)).trim();
    if (!name) return;

    createMut.mutate({
      name,
      slug,
      section: toSectionDb(newSection),
    });
  }

  function onSaveEdit(id: string) {
    const name = editName.trim();
    const slug = editSlug.trim() || slugifyLite(name);
    if (!name || !slug) return;

    updateMut.mutate({
      id,
      patch: {
        name,
        slug,
        section: toSectionDb(editSection),
      },
    });
  }

  return (
    <div className="container">
      <div className="adminTags">
        <header className="adminTags__header">
          <div>
            <h1 className="adminTags__title">Tags</h1>
            <p className="adminTags__subtitle">
              Crea, edita y elimina tags (GLOBAL / TECH / FASEC). Máx 3 por post (eso lo controla el editor).
            </p>
          </div>
        </header>

        {/* Crear */}
        <Card>
          <div className="card-pad">
            <div className="adminTags__create">
              <div className="adminTags__createGrid">
                <div>
                  <label className="fieldLabel">Nombre</label>
                  <input
                    className="fieldControl"
                    value={newName}
                    placeholder="Ej: Malware"
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewName(v);

                      // auto-slug si el usuario aún no escribió slug manualmente
                      if (!newSlug.trim()) {
                        setNewSlug(slugifyLite(v));
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="fieldLabel">Slug</label>
                  <input
                    className="fieldControl"
                    value={newSlug}
                    placeholder="Ej: malware"
                    onChange={(e) => setNewSlug(slugifyLite(e.target.value))}
                  />
                </div>

                <div>
                  <label className="fieldLabel">Sección</label>
                  <select
                    className="fieldControl"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value as SectionValue)}
                  >
                    <option value="GLOBAL">GLOBAL</option>
                    <option value="TECH">TECH</option>
                    <option value="FASEC">FASEC</option>
                  </select>
                </div>

                <div className="adminTags__createActions">
                  <button className="btn btn--primary" type="button" onClick={onCreate} disabled={createMut.isPending}>
                    {createMut.isPending ? "Creando…" : "Crear tag"}
                  </button>
                  {createMut.isError ? (
                    <p className="adminTags__error">Error: {(createMut.error as Error).message}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista + filtros */}
        <Card>
          <div className="card-pad">
            <div className="adminTags__topbar">
              <div className="adminTags__filters">
                <div>
                  <label className="fieldLabel">Filtrar por sección</label>
                  <select className="fieldControl" value={section} onChange={(e) => setSection(e.target.value as any)}>
                    <option value="">Todas</option>
                    <option value="TECH">TECH + GLOBAL</option>
                    <option value="FASEC">FASEC + GLOBAL</option>
                  </select>
                </div>

                <div className="adminTags__filtersSpan2">
                  <label className="fieldLabel">Buscar</label>
                  <input
                    className="fieldControl"
                    placeholder="Nombre, slug o sección…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              <div className="adminTags__stats">
                <span className="adminTags__muted">
                  Total: <strong>{filtered.length}</strong>
                </span>
              </div>
            </div>

            {tagsQ.isLoading ? (
              <p className="adminTags__muted">Cargando…</p>
            ) : tagsQ.isError ? (
              <p className="adminTags__error">Error: {(tagsQ.error as Error).message}</p>
            ) : (
              <div className="adminTags__tableWrap">
                <table className="adminTags__table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Slug</th>
                      <th>Sección</th>
                      <th>Creado</th>
                      <th className="adminTags__thRight">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((t) => {
                      const isEditing = editingId === t.id;

                      return (
                        <tr key={t.id}>
                          <td>
                            {isEditing ? (
                              <input
                                className="fieldControl fieldControl--sm"
                                value={editName}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setEditName(v);
                                }}
                              />
                            ) : (
                              <div className="adminTags__nameCell">
                                <span className="adminTags__name">{t.name}</span>
                              </div>
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                className="fieldControl fieldControl--sm"
                                value={editSlug}
                                onChange={(e) => setEditSlug(slugifyLite(e.target.value))}
                              />
                            ) : (
                              <span className="adminTags__slug">{t.slug}</span>
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <select
                                className="fieldControl fieldControl--sm"
                                value={editSection}
                                onChange={(e) => setEditSection(e.target.value as SectionValue)}
                              >
                                <option value="GLOBAL">GLOBAL</option>
                                <option value="TECH">TECH</option>
                                <option value="FASEC">FASEC</option>
                              </select>
                            ) : (
                              <span className="adminTags__pill">
                                {t.section ?? "GLOBAL"}
                              </span>
                            )}
                          </td>

                          <td className="adminTags__muted">
                            {new Date(t.created_at).toLocaleDateString()}
                          </td>

                          <td>
                            <div className="adminTags__actions">
                              {isEditing ? (
                                <>
                                  <button
                                    className="btn btn--sm btn--primary"
                                    type="button"
                                    onClick={() => onSaveEdit(t.id)}
                                    disabled={updateMut.isPending}
                                  >
                                    Guardar
                                  </button>
                                  <button className="btn btn--sm" type="button" onClick={cancelEdit}>
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="btn btn--sm" type="button" onClick={() => startEdit(t)}>
                                    Editar
                                  </button>

                                  <button
                                    className="btn btn--sm btn--danger"
                                    type="button"
                                    disabled={deleteMut.isPending}
                                    onClick={() => {
                                      const ok = confirm(
                                        `¿Borrar tag "${t.name}"?\n\nSi está en uso por algún post, el backend debe bloquearlo.`
                                      );
                                      if (!ok) return;
                                      deleteMut.mutate(t.id);
                                    }}
                                  >
                                    Borrar
                                  </button>
                                </>
                              )}
                            </div>

                            {updateMut.isError && isEditing ? (
                              <p className="adminTags__inlineError">
                                Error: {(updateMut.error as Error).message}
                              </p>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}

                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="adminTags__empty">
                          No hay tags para mostrar.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>

                {deleteMut.isError ? (
                  <p className="adminTags__error">
                    Error borrando: {(deleteMut.error as Error).message}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
