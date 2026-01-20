// src/pages/admin/editor/tiptap.ts
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import ImageResize from "tiptap-extension-resize-image";

export const editorExtensions = [
  StarterKit.configure({
    link: false, // porque usas Link aparte
  }),

  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: { rel: "noopener noreferrer nofollow" },
  }),

  Image,
  ImageResize,

  Youtube.configure({ controls: true, nocookie: true }),

  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,

  Placeholder.configure({ placeholder: "Escribe tu post…" }),
];
