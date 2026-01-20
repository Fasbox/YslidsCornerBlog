import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import { EditorContent, type Editor } from "@tiptap/react";

export default function PostTipTapEditor({ editor }: { editor: Editor | null }) {
  // Re-render cuando cambian selección/estado
  const [, force] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const rerender = () => force((x) => x + 1);

    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);
    editor.on("update", rerender);

    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
      editor.off("update", rerender);
    };
  }, [editor]);

  if (!editor) {
    return (
      <Card>
        <div className="card-pad">
          <p className="helpText">Cargando editor…</p>
        </div>
      </Card>
    );
  }

  const btn = "btn";

  // ✅ TipTap: usar can() SIN focus
  const can = {
    undo: editor.can().chain().undo().run(),
    redo: editor.can().chain().redo().run(),

    bold: editor.can().chain().toggleBold().run(),
    italic: editor.can().chain().toggleItalic().run(),
    strike: editor.can().chain().toggleStrike().run(),
    code: editor.can().chain().toggleCode().run(),

    h2: editor.can().chain().toggleHeading({ level: 2 }).run(),
    h3: editor.can().chain().toggleHeading({ level: 3 }).run(),

    bullet: editor.can().chain().toggleBulletList().run(),
    ordered: editor.can().chain().toggleOrderedList().run(),
    blockquote: editor.can().chain().toggleBlockquote().run(),
    hr: editor.can().chain().setHorizontalRule().run(),
    codeBlock: editor.can().chain().toggleCodeBlock().run(),

    // Link
    unsetLink: editor.isActive("link") && editor.can().chain().unsetLink().run(),

    // Table (solo si estoy dentro de tabla)
    addColAfter: editor.isActive("table") && editor.can().chain().addColumnAfter().run(),
    addColBefore: editor.isActive("table") && editor.can().chain().addColumnBefore().run(),
    delCol: editor.isActive("table") && editor.can().chain().deleteColumn().run(),

    addRowAfter: editor.isActive("table") && editor.can().chain().addRowAfter().run(),
    addRowBefore: editor.isActive("table") && editor.can().chain().addRowBefore().run(),
    delRow: editor.isActive("table") && editor.can().chain().deleteRow().run(),

    delTable: editor.isActive("table") && editor.can().chain().deleteTable().run(),
  };

  const isActive = {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    strike: editor.isActive("strike"),
    code: editor.isActive("code"),
    h2: editor.isActive("heading", { level: 2 }),
    h3: editor.isActive("heading", { level: 3 }),
    bullet: editor.isActive("bulletList"),
    ordered: editor.isActive("orderedList"),
    blockquote: editor.isActive("blockquote"),
    codeBlock: editor.isActive("codeBlock"),
    link: editor.isActive("link"),
    table: editor.isActive("table"),
  };

  const cls = (base: string, active?: boolean) =>
    active ? `${base} editorBtn--active` : base;

  const insertLink = () => {
    const prev = editor.getAttributes("link")?.href ?? "";
    const url = window.prompt("URL del enlace:", prev);
    if (!url) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const removeLink = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link") // ✅ clave para que funcione parado en 1 caracter
      .unsetLink()
      .run();
  };

  const insertImageUrl = () => {
    const url = window.prompt("URL de la imagen:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const insertYouTube = () => {
    const url = window.prompt("URL de YouTube:");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <Card>
      <div className="card-pad">
        <div className="editorStack">
          <div className="editorToolbar editorToolbar--sticky">
            {/* Formato */}
            <button className={cls(btn, isActive.bold)} type="button" disabled={!can.bold}
              onClick={() => editor.chain().focus().toggleBold().run()}>
              Negrita
            </button>

            <button className={cls(btn, isActive.italic)} type="button" disabled={!can.italic}
              onClick={() => editor.chain().focus().toggleItalic().run()}>
              Itálica
            </button>

            <button className={cls(btn, isActive.strike)} type="button" disabled={!can.strike}
              onClick={() => editor.chain().focus().toggleStrike().run()}>
              Tachado
            </button>

            <button className={cls(btn, isActive.code)} type="button" disabled={!can.code}
              onClick={() => editor.chain().focus().toggleCode().run()}>
              Inline
            </button>

            <span className="editorToolbar__sep" />

            {/* Headings */}
            <button className={cls(btn, isActive.h2)} type="button" disabled={!can.h2}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              H2
            </button>

            <button className={cls(btn, isActive.h3)} type="button" disabled={!can.h3}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              H3
            </button>

            <span className="editorToolbar__sep" />

            {/* Listas + bloques */}
            <button className={cls(btn, isActive.bullet)} type="button" disabled={!can.bullet}
              onClick={() => editor.chain().focus().toggleBulletList().run()}>
              Lista
            </button>

            <button className={cls(btn, isActive.ordered)} type="button" disabled={!can.ordered}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              1-2-3
            </button>

            <button className={cls(btn, isActive.blockquote)} type="button" disabled={!can.blockquote}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              Cita
            </button>

            <button className={btn} type="button" disabled={!can.hr}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              Separador
            </button>

            <button className={cls(btn, isActive.codeBlock)} type="button" disabled={!can.codeBlock}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              Code block
            </button>

            <span className="editorToolbar__sep" />

            {/* Link / Media */}
            <button className={btn} type="button" onClick={insertLink}>Link</button>

            <button className={cls(btn, isActive.link)} type="button" disabled={!can.unsetLink}
              onClick={removeLink}>
              Quitar link
            </button>

            <button className={btn} type="button" onClick={insertImageUrl}>Imagen (URL)</button>
            <button className={btn} type="button" onClick={insertYouTube}>YouTube</button>

            <span className="editorToolbar__sep" />

            {/* Tabla */}
            <button className={cls(btn, isActive.table)} type="button" onClick={insertTable}>
              Tabla
            </button>

            <button className={btn} type="button" disabled={!can.addColBefore}
              onClick={() => editor.chain().focus().addColumnBefore().run()}>
              +Col ←
            </button>

            <button className={btn} type="button" disabled={!can.addColAfter}
              onClick={() => editor.chain().focus().addColumnAfter().run()}>
              +Col →
            </button>

            <button className={btn} type="button" disabled={!can.addRowBefore}
              onClick={() => editor.chain().focus().addRowBefore().run()}>
              +Fila ↑
            </button>

            <button className={btn} type="button" disabled={!can.addRowAfter}
              onClick={() => editor.chain().focus().addRowAfter().run()}>
              +Fila ↓
            </button>

            <button className={btn} type="button" disabled={!can.delCol}
              onClick={() => editor.chain().focus().deleteColumn().run()}>
              -Col
            </button>

            <button className={btn} type="button" disabled={!can.delRow}
              onClick={() => editor.chain().focus().deleteRow().run()}>
              -Fila
            </button>

            <button className={btn} type="button" disabled={!can.delTable}
              onClick={() => editor.chain().focus().deleteTable().run()}>
              Quitar tabla
            </button>

            <span className="editorToolbar__sep" />

            {/* Historial */}
            <button className={btn} type="button" disabled={!can.undo}
              onClick={() => editor.chain().focus().undo().run()}>
              ↶
            </button>

            <button className={btn} type="button" disabled={!can.redo}
              onClick={() => editor.chain().focus().redo().run()}>
              ↷
            </button>
          </div>

          <div className="editorFrame">
            <EditorContent editor={editor} className="tiptap-content" />
          </div>

          <p className="helpText">MVP: imágenes por URL + YouTube embed. Luego añadimos upload.</p>
        </div>
      </div>
    </Card>
  );
}
