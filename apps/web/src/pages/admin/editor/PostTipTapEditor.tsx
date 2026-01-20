import { useEffect, useMemo, useState } from "react";
import Card from "../../../components/Card";
import { EditorContent, type Editor } from "@tiptap/react";

export default function PostTipTapEditor({ editor }: { editor: Editor | null }) {
  // Fuerza re-render cuando el editor cambia selección/historial/estado.
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

  const toolbar = useMemo(() => {
    if (!editor) return null;

    const btn = "btn";

    // Helpers para disabled (TipTap recomienda usar can()).
    const can = {
      undo: editor.can().chain().focus().undo().run(),
      redo: editor.can().chain().focus().redo().run(),

      bold: editor.can().chain().focus().toggleBold().run(),
      italic: editor.can().chain().focus().toggleItalic().run(),
      strike: editor.can().chain().focus().toggleStrike().run(),
      code: editor.can().chain().focus().toggleCode().run(),

      h2: editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
      h3: editor.can().chain().focus().toggleHeading({ level: 3 }).run(),

      bullet: editor.can().chain().focus().toggleBulletList().run(),
      ordered: editor.can().chain().focus().toggleOrderedList().run(),
      blockquote: editor.can().chain().focus().toggleBlockquote().run(),
      hr: editor.can().chain().focus().setHorizontalRule().run(),
      codeBlock: editor.can().chain().focus().toggleCodeBlock().run(),

      // Link
      unsetLink: editor.isActive("link") && editor.can().chain().focus().unsetLink().run(),

      // Table: solo habilitar si estoy dentro de tabla (o si puedo ejecutar)
      addColAfter: editor.isActive("table") && editor.can().chain().focus().addColumnAfter().run(),
      addColBefore: editor.isActive("table") && editor.can().chain().focus().addColumnBefore().run(),
      delCol: editor.isActive("table") && editor.can().chain().focus().deleteColumn().run(),

      addRowAfter: editor.isActive("table") && editor.can().chain().focus().addRowAfter().run(),
      addRowBefore: editor.isActive("table") && editor.can().chain().focus().addRowBefore().run(),
      delRow: editor.isActive("table") && editor.can().chain().focus().deleteRow().run(),

      delTable: editor.isActive("table") && editor.can().chain().focus().deleteTable().run(),
    };

    const insertLink = () => {
      // Si ya hay link activo, pre-llenar
      const prev = editor.getAttributes("link")?.href ?? "";
      const url = window.prompt("URL del enlace:", prev);
      if (!url) return;
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
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
      // Esto crea tabla base (si ya estás en tabla, no hace nada raro)
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
      <div className="editorToolbar editorToolbar--sticky">
        {/* Formato */}
        <button className={btn} type="button" disabled={!can.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          Negrita
        </button>
        <button className={btn} type="button" disabled={!can.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Itálica
        </button>
        <button className={btn} type="button" disabled={!can.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          Tachado
        </button>
        <button className={btn} type="button" disabled={!can.code} onClick={() => editor.chain().focus().toggleCode().run()}>
          Inline
        </button>

        <span className="editorToolbar__sep" />

        {/* Headings */}
        <button className={btn} type="button" disabled={!can.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button className={btn} type="button" disabled={!can.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <span className="editorToolbar__sep" />

        {/* Listas + bloques */}
        <button className={btn} type="button" disabled={!can.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Lista
        </button>
        <button className={btn} type="button" disabled={!can.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1-2-3
        </button>
        <button className={btn} type="button" disabled={!can.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Cita
        </button>
        <button className={btn} type="button" disabled={!can.hr} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Separador
        </button>
        <button className={btn} type="button" disabled={!can.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code block
        </button>

        <span className="editorToolbar__sep" />

        {/* Link / Media */}
        <button className={btn} type="button" onClick={insertLink}>
          Link
        </button>
        <button className={btn} type="button" disabled={!can.unsetLink} onClick={() => editor.chain().focus().unsetLink().run()}>
          Quitar link
        </button>
        <button className={btn} type="button" onClick={insertImageUrl}>
          Imagen (URL)
        </button>
        <button className={btn} type="button" onClick={insertYouTube}>
          YouTube
        </button>

        <span className="editorToolbar__sep" />

        {/* Tabla */}
        <button className={btn} type="button" onClick={insertTable}>
          Tabla
        </button>
        <button className={btn} type="button" disabled={!can.addColBefore} onClick={() => editor.chain().focus().addColumnBefore().run()}>
          +Col ←
        </button>
        <button className={btn} type="button" disabled={!can.addColAfter} onClick={() => editor.chain().focus().addColumnAfter().run()}>
          +Col →
        </button>
        <button className={btn} type="button" disabled={!can.addRowBefore} onClick={() => editor.chain().focus().addRowBefore().run()}>
          +Fila ↑
        </button>
        <button className={btn} type="button" disabled={!can.addRowAfter} onClick={() => editor.chain().focus().addRowAfter().run()}>
          +Fila ↓
        </button>
        <button className={btn} type="button" disabled={!can.delCol} onClick={() => editor.chain().focus().deleteColumn().run()}>
          -Col
        </button>
        <button className={btn} type="button" disabled={!can.delRow} onClick={() => editor.chain().focus().deleteRow().run()}>
          -Fila
        </button>
        <button className={btn} type="button" disabled={!can.delTable} onClick={() => editor.chain().focus().deleteTable().run()}>
          Quitar tabla
        </button>

        <span className="editorToolbar__sep" />

        {/* Historial */}
        <button className={btn} type="button" disabled={!can.undo} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </button>
        <button className={btn} type="button" disabled={!can.redo} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </button>
      </div>
    );
  }, [editor]);

  return (
    <Card>
      <div className="card-pad">
        <div className="editorStack">
          {toolbar}

          <div className="editorFrame">
            <EditorContent editor={editor} className="tiptap-content" />
          </div>

          <p className="helpText">MVP: imágenes por URL + YouTube embed. Luego añadimos upload.</p>
        </div>
      </div>
    </Card>
  );
}
