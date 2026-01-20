// src/pages/admin/editor/AdminEditorPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Card from "../../../components/Card";

import { getAdminPost, updateAdminPost } from "../../../features/admin/adminPostDetail.api";
import { updatePostTags } from "../../../features/admin/adminPostsTags.api";

import { fetchAdminSeries, createAdminSeries } from "../../../features/admin/adminSeries.api";
import { getAdminPostSeries, setAdminPostSeries } from "../../../features/admin/adminPostSeries.api";

import { useAdminTags } from "../../../hooks/useAdminTags";
import { extractPlainText, estimateReadingTimeMinutes } from "../../../features/posts/content.utils";
import { slugify } from "../../../utils/slugify";

// TipTap
import { useEditor } from "@tiptap/react";
import { editorExtensions } from "./tiptap";


// Componentes modulares
import PostMetaForm, { type PostSection } from "./PostMetaForm";
import PostTagsCard from "./PostTagsCard";
import PostTipTapEditor from "./PostTipTapEditor";


type TagDTO = { id: string; name: string; slug: string; section: "TECH" | "FASEC" | null };

type AdminPostDTO = {
  id: string;
  section: "TECH" | "FASEC";
  status: "DRAFT" | "PUBLISHED";
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: any;
  content_text?: string | null;
  reading_time?: number | null;
  cover_image_url?: string | null;
  tags?: TagDTO[];
};

function emptyDoc() {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

function normalizeDoc(maybe: any) {
  if (!maybe || typeof maybe !== "object") return emptyDoc();
  if (maybe.type !== "doc") return emptyDoc();
  if (!Array.isArray(maybe.content)) return emptyDoc();
  return maybe;
}

export default function AdminEditorPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();

  const [msg, setMsg] = useState<string | null>(null);

  // form state
  const [section, setSection] = useState<"TECH" | "FASEC">("TECH");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // series (MVP: 0 o 1)
  const [seriesId, setSeriesIdState] = useState<string | null>(null);

  // tags (max 3)
  const [tagIds, setTagIds] = useState<string[]>([]);

  // TipTap editor instance
  const editor = useEditor({
    extensions: editorExtensions,
    content: emptyDoc(),
  });


  const postQ = useQuery({
    queryKey: ["adminPost", id],
    queryFn: () => getAdminPost(id!) as Promise<AdminPostDTO>,
    enabled: Boolean(id),
  });

  // series: listado por sección
  const seriesQ = useQuery({
    queryKey: ["adminSeries", section],
    queryFn: () => fetchAdminSeries({ section }),
    enabled: true,
    placeholderData: (prev) => prev,
  });

  // series del post
  const postSeriesQ = useQuery({
    queryKey: ["adminPostSeries", id],
    queryFn: () => getAdminPostSeries(id!),
    enabled: Boolean(id),
  });

  // tags disponibles según sección
  const tagsQ = useAdminTags(section);

  // cargar data → state + editor content
  useEffect(() => {
    if (!postQ.data) return;

    const data = postQ.data;

    setSection(data.section);
    setTitle(data.title ?? "");
    setSlug(data.slug ?? "");
    setSlugTouched(false);
    setExcerpt(data.excerpt ?? "");
    setCoverUrl(data.cover_image_url ?? "");
    setTagIds((data.tags ?? []).map((t) => t.id));
  }, [postQ.data]);

  useEffect(() => {
    if (!postQ.data || !editor) return;
    editor.commands.setContent(normalizeDoc(postQ.data.content_json));
  }, [postQ.data, editor]);

  useEffect(() => {
    // set seriesId state from backend
    if (!postSeriesQ.data) return;
    setSeriesIdState(postSeriesQ.data.series_id ?? null);
  }, [postSeriesQ.data]);

  const setSeriesMut = useMutation({
    mutationFn: async (nextSeriesId: string | null) => {
      if (!id) throw new Error("Falta id");
      await setAdminPostSeries(id, nextSeriesId);
      setSeriesIdState(nextSeriesId);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminPostSeries", id] });
      await qc.invalidateQueries({ queryKey: ["adminPosts"] });
    },
    onError: (e: any) => setMsg(`❌ ${e?.message ?? "Error asignando serie"}`),
  });

  const createSeriesMut = useMutation({
    mutationFn: async (input: { title: string; slug: string }) => {
      const titleClean = input.title.trim();
      if (titleClean.length < 3) throw new Error("El título de la serie es muy corto");
      const slugVal = (input.slug?.trim() ? input.slug : slugify(titleClean)) as string;

      const created = await createAdminSeries({
        section,
        title: titleClean,
        slug: slugVal,
        description: null,
      });

      return created;
    },
    onSuccess: async (created) => {
      // refresca listado series y asigna al post
      await qc.invalidateQueries({ queryKey: ["adminSeries", section] });
      if (id) setSeriesMut.mutate(created.id);
    },
    onError: (e: any) => setMsg(`❌ ${e?.message ?? "Error creando serie"}`),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Falta id");
      if (!editor) throw new Error("Editor no listo");

      const content_json = editor.getJSON();
      const content_text = extractPlainText(content_json);
      const reading_time = estimateReadingTimeMinutes(content_text);

      await updateAdminPost(id, {
        section,
        title,
        slug,
        excerpt,
        cover_image_url: coverUrl.trim() ? coverUrl.trim() : null,
        content_json,
        content_text,
        reading_time,
      });

      await updatePostTags(id, tagIds);

      // serie ya se persiste con setSeriesMut (en cambio inmediato),
      // pero si quieres “guardar todo junto”, aquí podrías setear también:
      // await setAdminPostSeries(id, seriesId);
    },
    onSuccess: async () => {
      setMsg("✅ Guardado");
      await qc.invalidateQueries({ queryKey: ["adminPost", id] });
      await qc.invalidateQueries({ queryKey: ["adminPosts"] });
      setTimeout(() => setMsg(null), 1200);
    },
    onError: (e: any) => setMsg(`❌ ${e?.message ?? "Error guardando"}`),
  });

  const canSave = useMemo(() => {
    return Boolean(id) && title.trim().length >= 3 && slug.trim().length >= 3;
  }, [id, title, slug]);

  if (!id) {
    return (
      <div className="container">
        <Card>
          <div className="card-pad">
            <p className="helpText">Falta el id en la ruta.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="adminEditor">
        <header className="adminEditor__header">
          <div>
            <h1 className="adminEditor__title">Editor</h1>
            <p className="adminEditor__subtitle">Editando: {id}</p>
          </div>

          <div className="adminEditor__actions">
            <button type="button" onClick={() => nav("/admin")} className="btn">
              ← Volver
            </button>
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={!canSave || saveMutation.isPending}
              className="btn btn--primary"
            >
              {saveMutation.isPending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </header>

        {msg ? (
          <Card>
            <div className="card-pad">
              <p className="editorMsg">{msg}</p>
            </div>
          </Card>
        ) : null}

        {postQ.isLoading ? (
          <Card>
            <div className="card-pad">
              <p className="helpText">Cargando post…</p>
            </div>
          </Card>
        ) : postQ.isError ? (
          <Card>
            <div className="card-pad">
              <p className="helpText">Error: {(postQ.error as Error).message}</p>
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="card-pad">
                <PostMetaForm
                  section={section}
                  title={title}
                  slug={slug}
                  excerpt={excerpt}
                  coverUrl={coverUrl}
                  slugTouched={slugTouched}
                  onSlugTouched={setSlugTouched}
                  onChangeSection={(next: PostSection) => {
                    setSection(next);
                    setTagIds([]);
                    // al cambiar de sección, también quitamos serie (mvp)
                    setSeriesMut.mutate(null);
                    qc.invalidateQueries({ queryKey: ["tags", next] });
                    qc.invalidateQueries({ queryKey: ["adminSeries", next] });
                  }}
                  onChangeTitle={(v: string) => {
                    setTitle(v);
                    if (!slugTouched) setSlug(slugify(v));
                  }}
                  onChangeSlug={(v: string) => setSlug(slugify(v))}
                  onRegenerateSlug={() => {
                    setSlugTouched(false);
                    setSlug(slugify(title));
                  }}
                  onChangeExcerpt={(v: string) => setExcerpt(v)}
                  onChangeCoverUrl={(v: string) => setCoverUrl(v)}
                  seriesId={seriesId}
                  seriesOptions={(seriesQ.data?.items ?? []).map((s) => ({
                    id: s.id,
                    title: s.title,
                    slug: s.slug,
                  }))}
                  isSeriesLoading={seriesQ.isLoading || postSeriesQ.isLoading}
                  onChangeSeriesId={(nextId) => setSeriesMut.mutate(nextId)}
                  onCreateSeries={(input) => createSeriesMut.mutate(input)}
                />
              </div>
            </Card>

            <PostTagsCard
              isLoading={tagsQ.isLoading}
              isError={tagsQ.isError}
              error={tagsQ.error as Error}
              tags={tagsQ.data?.items ?? []}
              value={tagIds}
              onChange={setTagIds}
            />

            <PostTipTapEditor editor={editor} />
          </>
        )}
      </div>
    </div>
  );
}
