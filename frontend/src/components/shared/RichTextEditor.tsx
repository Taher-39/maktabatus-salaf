"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

// react-quill v2 internally calls `findDOMNode` (removed in React 19).
// We use `react-quill-new` (a React 19-compatible fork) wrapped in next/dynamic
// with `ssr: false` to avoid the module-level `document`/`window` access during
// server-side rendering.
const ReactQuill = dynamic(
  () => import("react-quill-new").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
        aria-label="Editor loading"
      />
    ),
  }
) as unknown as React.ComponentType<any>;

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string; // e.g. "160px"
}

/**
 * Reusable Quill (react-quill) rich-text editor.
 * - Client-only render (avoids `findDOMNode` crash on React 19)
 * - Configured for Bangla + English content
 * - Light / dark friendly wrapper
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "এখানে লিখুন...",
  className = "",
  minHeight = "160px",
}: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Modules / formats are memoized so React-Quill doesn't re-init unnecessarily
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "align",
      "blockquote",
      "code-block",
      "link",
    ],
    []
  );

  // Apply min-height to the inner editor area after mount / value change
  useEffect(() => {
    if (!isClient) return;
    const root = document.querySelector(
      ".rich-text-editor .ql-editor"
    ) as HTMLElement | null;
    if (root) {
      root.style.minHeight = minHeight;
    }
  }, [isClient, minHeight, value]);

  return (
    <div
      className={`rich-text-editor rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${className}`}
    >
      {isClient ? (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      ) : (
        <div
          className="h-32 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
          aria-label="Editor loading"
        />
      )}
    </div>
  );
}
