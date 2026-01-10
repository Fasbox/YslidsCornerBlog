import { useMemo } from "react";
import Card from "../../../components/Card";
import { EditorContent, type Editor } from "@tiptap/react";

export default function PostTipTapEditor({ editor }: { editor: Editor | null }) {
  const toolbar = useMemo(() => {
    if (!editor) return null;

    const btn = "btn"; // ya tienes .btn en cards.css

    const insertLink = () => {
      const url = window.prompt("URL del enlace:");
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

    return (
      <div className="editorToolbar">
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleBold().run()}>Negrita</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>Lista</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1-2-3</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code block</button>
        <button className={btn} type="button" onClick={insertLink}>Link</button>
        <button className={btn} type="button" onClick={() => editor.chain().focus().unsetLink().run()}>Quitar link</button>
        <button className={btn} type="button" onClick={insertImageUrl}>Imagen (URL)</button>
        <button className={btn} type="button" onClick={insertYouTube}>YouTube</button>
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
          <p className="helpText">
            MVP: imágenes por URL + YouTube embed. Luego añadimos upload a Supabase Storage.
          </p>
        </div>
      </div>
    </Card>
  );
}
