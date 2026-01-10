// src/pages/admin/editor/tiptap.ts
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";

export const editorExtensions = [
  StarterKit.configure({ link: false }),
  Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
  Image,
  Youtube.configure({ controls: true, nocookie: true }),
  Placeholder.configure({ placeholder: "Escribe tu post…" }),
];
