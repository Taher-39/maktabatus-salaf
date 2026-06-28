"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSave } from "react-icons/fi";
import RichTextEditor from "@/components/shared/RichTextEditor";
import Modal from "@/components/admin/Modal";

export type BlogDraft = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  isPublished: boolean;
};

export default function BlogModal({
  open,
  mode,
  initial,
  submitting,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Partial<BlogDraft>;
  submitting: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (draft: BlogDraft) => void;
}) {
  const safeInitial = useMemo<BlogDraft>(
    () => ({
      title: initial?.title ?? "",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      category: initial?.category ?? "",
      isPublished: initial?.isPublished ?? true,
    }),
    [initial]
  );

  const [draft, setDraft] = useState<BlogDraft>(safeInitial);

  useEffect(() => {
    if (!open) return;
    setDraft(safeInitial);
  }, [open, safeInitial]);

  const canSubmit = useMemo(() => {
    return (
      draft.title.trim().length >= 5 &&
      draft.excerpt.trim().length >= 10 &&
      draft.content.trim().length >= 50 &&
      draft.category.trim().length >= 1
    );
  }, [draft]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "নতুন ব্লগ" : "ব্লগ এডিট"}
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            {/* placeholder for future helper */}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              বাতিল
            </button>
            <button
              type="button"
              disabled={submitting || !canSubmit}
              onClick={() => onSubmit(draft)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              <FiSave size={16} />
              {submitting ? "সেভ হচ্ছে..." : mode === "create" ? "ব্লগ তৈরি করুন" : "আপডেট করুন"}
            </button>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            শিরোনাম *
          </label>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="ব্লগের শিরোনাম লিখুন"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            ক্যাটাগরি *
          </label>
          <input
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="যেমন: ইসলামিক জ্ঞান, কুরআন, হাদিস"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            সংক্ষিপ্ত বিবরণ *
          </label>
          <textarea
            value={draft.excerpt}
            onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="ব্লগের একটি সংক্ষিপ্ত বিবরণ দিন"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            বিস্তারিত কন্টেন্ট *
          </label>
          <RichTextEditor
            value={draft.content}
            onChange={(v) => setDraft((d) => ({ ...d, content: v }))}
            minHeight="320px"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(e) => setDraft((d) => ({ ...d, isPublished: e.target.checked }))}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {draft.isPublished ? "প্রকাশিত" : "ড্রাফট"}
          </span>
        </div>
      </div>
    </Modal>
  );
}

