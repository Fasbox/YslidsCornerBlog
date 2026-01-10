import { useEffect } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

type Props = {
  content: JSONContent | null | undefined;
};

export default function PostContent({ content }: Props) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
  });

  // Si llega contenido después (fetch), lo seteamos una vez
  useEffect(() => {
    if (!editor) return;
    if (!content) return;
    editor.commands.setContent(content);
  }, [editor, content]);

  if (!editor) return null;

  return <EditorContent editor={editor} className="tiptap-content" />;
}
