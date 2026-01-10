// src/pages/admin/editor/PostMetaForm.tsx
export type PostSection = "TECH" | "FASEC";

type SeriesOption = { id: string; title: string; slug: string };

export default function PostMetaForm(props: {
  section: PostSection;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;

  slugTouched: boolean;
  onSlugTouched: (v: boolean) => void;

  // series
  seriesId: string | null;
  seriesOptions: SeriesOption[];
  isSeriesLoading: boolean;
  onChangeSeriesId: (id: string | null) => void;
  onCreateSeries: (input: { title: string; slug: string }) => void;

  onChangeSection: (next: PostSection) => void;
  onChangeTitle: (v: string) => void;
  onChangeSlug: (v: string) => void;
  onRegenerateSlug: () => void;
  onChangeExcerpt: (v: string) => void;
  onChangeCoverUrl: (v: string) => void;
}) {
  const {
    section,
    title,
    slug,
    excerpt,
    coverUrl,
    slugTouched,
    onSlugTouched,
    onChangeSection,
    onChangeTitle,
    onChangeSlug,
    onRegenerateSlug,
    onChangeExcerpt,
    onChangeCoverUrl,

    seriesId,
    seriesOptions,
    isSeriesLoading,
    onChangeSeriesId,
    onCreateSeries,
  } = props;

  return (
    <div className="metaGrid">
      <div>
        <label className="fieldLabel">Sección</label>
        <select
          className="fieldControl"
          value={section}
          onChange={(e) => onChangeSection(e.target.value as PostSection)}
        >
          <option value="TECH">TECH</option>
          <option value="FASEC">FASEC</option>
        </select>
      </div>

      <div>
        <label className="fieldLabel">Slug</label>
        <div className="inlineRow">
          <div className="inlineRow__grow">
            <input
              className="fieldControl"
              value={slug}
              onChange={(e) => {
                onSlugTouched(true);
                onChangeSlug(e.target.value);
              }}
            />
          </div>
          <button type="button" className="btn" onClick={onRegenerateSlug}>
            Regenerar
          </button>
        </div>
        {!slugTouched ? (
          <p className="helpText">Se autogenera desde el título (hasta que lo edites).</p>
        ) : null}
      </div>

      <div className="metaGrid__span2">
        <label className="fieldLabel">Título</label>
        <input
          className="fieldControl"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
      </div>

      <div className="metaGrid__span2">
        <label className="fieldLabel">Excerpt</label>
        <textarea
          className="fieldControl"
          rows={3}
          value={excerpt}
          onChange={(e) => onChangeExcerpt(e.target.value)}
        />
      </div>

      <div className="metaGrid__span2">
        <label className="fieldLabel">Cover (URL)</label>
        <input
          className="fieldControl"
          value={coverUrl}
          onChange={(e) => onChangeCoverUrl(e.target.value)}
          placeholder="https://…"
        />

        {coverUrl?.trim() ? (
          <div className="coverPreview">
            <img src={coverUrl.trim()} alt="" loading="lazy" />
          </div>
        ) : null}

        <p className="helpText">Tip: usa una URL https pública (CDN / raw / etc.).</p>
      </div>

      {/* SERIES */}
      <div className="metaGrid__span2">
        <label className="fieldLabel">Serie</label>

        <div className="seriesRow">
          <select
            className="fieldControl"
            value={seriesId ?? ""}
            onChange={(e) => onChangeSeriesId(e.target.value ? e.target.value : null)}
            disabled={isSeriesLoading}
          >
            <option value="">{isSeriesLoading ? "Cargando…" : "Sin serie"}</option>
            {seriesOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn"
            onClick={() => {
              const title = window.prompt("Título de la nueva serie:");
              if (!title) return;
              const slug = window.prompt("Slug (vacío = autogenerar):") ?? "";
              onCreateSeries({ title, slug });
            }}
          >
            + Crear serie
          </button>
        </div>

        <p className="helpText">
          MVP: un post pertenece a 0 o 1 serie (se puede ampliar a múltiples luego).
        </p>
      </div>
    </div>
  );
}
