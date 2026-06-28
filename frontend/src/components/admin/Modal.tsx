"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal"}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-[92vw] max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
        {title && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ✕
            </button>
          </div>
        )}

        <div className="max-h-[78vh] overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

