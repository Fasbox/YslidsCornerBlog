import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { createPost } from "../../features/admin/adminPosts.api";
import { slugify } from "../../utils/slugify";

// tags
import { useTags } from "../../features/tags/useTags";
import TagPicker from "../../components/TagPicker";
import { updatePostTags } from "../../features/admin/adminPostsTags.api";

export default function AdminNewPostPage() {
  const nav = useNavigate();

  const [section, setSection] = useState<"TECH" | "FASEC">("TECH");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [tagIds, setTagIds] = useState<string[]>([]);
  const tagsQ = useTags(section);

  const canCreate = useMemo(() => {
    return title.trim().length >= 3 && slug.trim().length >= 3 && !loading;
  }, [title, slug, loading]);

  async function onCreate() {
    if (!canCreate) return;

    setMsg(null);
    setLoading(true);

    try {
      const created = await createPost({ section, title: title.trim(), slug: slug.trim() });

      if (tagIds.length > 0) {
        await updatePostTags(created.id, tagIds);
      }

      nav(`/admin/editor/${created.id}`);

      // reset (opcional, realmente ya navegas)
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setTagIds([]);
    } catch (e: any) {
      setMsg(e?.message ?? "Error creando post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="adminEditor">
        <header className="adminEditor__header">
          <div>
            <h1 className="adminEditor__title">Nuevo post</h1>
            <p className="adminEditor__subtitle">Crea un draft y pasa directo al editor.</p>
          </div>

          <div className="adminEditor__actions">
            <button type="button" className="btn" onClick={() => nav("/admin")}>
              ← Volver
            </button>
          </div>
        </header>

        <Card>
          <div className="card-pad">
            <div className="metaGrid">
              <div>
                <label className="fieldLabel">Sección</label>
                <select
                  className="fieldControl"
                  value={section}
                  onChange={(e) => {
                    const next = e.target.value as "TECH" | "FASEC";
                    setSection(next);
                    setTagIds([]); // limpiar tags al cambiar sección
                  }}
                >
                  <option value="TECH">TECH</option>
                  <option value="FASEC">FASEC</option>
                </select>
                <p className="helpText">Esto define los tags disponibles y el tema visual.</p>
              </div>

              <div>
                <label className="fieldLabel">Slug</label>
                <input
                  className="fieldControl"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="ej: mi-primer-post"
                />
                <p className="helpText">URL del post. Solo minúsculas y guiones.</p>
              </div>

              <div className="metaGrid__span2">
                <label className="fieldLabel">Título</label>
                <input
                  className="fieldControl"
                  value={title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTitle(v);
                    if (!slugTouched) setSlug(slugify(v));
                  }}
                  placeholder="Ej: Cómo configurar WAF en 2026"
                />
              </div>

              <div className="metaGrid__span2">
                {tagsQ.isLoading ? (
                  <p className="helpText">Cargando tags…</p>
                ) : tagsQ.isError ? (
                  <p className="helpText">
                    Error cargando tags: {(tagsQ.error as Error)?.message ?? "desconocido"}
                  </p>
                ) : (
                  <TagPicker tags={tagsQ.data?.items ?? []} value={tagIds} onChange={setTagIds} max={3} />
                )}
              </div>

              {msg ? (
                <div className="metaGrid__span2">
                  <p className="helpText">{msg}</p>
                </div>
              ) : null}

              <div className="metaGrid__span2">
                <button
                  type="button"
                  onClick={onCreate}
                  disabled={!canCreate}
                  className="btn btn--primary"
                >
                  {loading ? "Creando…" : "Crear y abrir editor"}
                </button>
                {!canCreate ? (
                  <p className="helpText">Completa título y slug (mínimo 3 caracteres).</p>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
