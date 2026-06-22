"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  previewPages?: string[]; // image URLs (সর্বোচ্চ ৭টা)
  previewPdf?: string;     // PDF URL (থাকলে iframe দিয়ে দেখাবে)
  bookTitle: string;
}

const MAX_PAGES = 7;

export default function PreviewModal({
  isOpen,
  onClose,
  previewPages = [],
  previewPdf,
  bookTitle,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  // Modal খুললে page reset
  useEffect(() => {
    if (isOpen) setCurrentPage(0);
  }, [isOpen]);

  // ESC key দিয়ে বন্ধ
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, currentPage]);

  // ৭ পেজের বেশি দেখাবে না
  const pages = previewPages.slice(0, MAX_PAGES);
  const totalPages = pages.length;

  const prevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:inset-8 lg:inset-16"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-emerald-900 px-4 py-3">
              <div>
                <p className="text-xs text-emerald-300">পূর্বরূপ দেখুন</p>
                <h3 className="line-clamp-1 text-sm font-bold text-white">
                  {bookTitle}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {totalPages > 0 && (
                  <span className="text-xs text-emerald-300">
                    {currentPage + 1} / {totalPages} পেজ
                    {previewPages.length > MAX_PAGES && (
                      <span className="ml-1">(সর্বোচ্চ {MAX_PAGES} পেজ)</span>
                    )}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-hidden bg-gray-100">

              {/* ── PDF URL থাকলে iframe ── */}
              {previewPdf && (
                <iframe
                  src={`${previewPdf}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                  className="h-full w-full border-0"
                  title={bookTitle}
                />
              )}

              {/* ── previewPages (image array) থাকলে ── */}
              {!previewPdf && pages.length > 0 && (
                <div className="flex h-full flex-col">
                  {/* Page Image */}
                  <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPage}
                        src={pages[currentPage]}
                        alt={`পেজ ${currentPage + 1}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4 border-t bg-white py-3">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      ← আগের পেজ
                    </button>

                    {/* Thumbnail dots */}
                    <div className="flex gap-1">
                      {pages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentPage
                              ? "w-5 bg-emerald-700"
                              : "w-2 bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage >= totalPages - 1}
                      className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      পরের পেজ →
                    </button>
                  </div>
                </div>
              )}

              {/* ── কিছুই না থাকলে ── */}
              {!previewPdf && pages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">এই বইয়ের পূর্বরূপ পাওয়া যাচ্ছে না</p>
                </div>
              )}

              {/* আগে/পরে arrow — image mode-এ side-এ দেখাবে */}
              {!previewPdf && pages.length > 1 && (
                <>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white disabled:opacity-0"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white disabled:opacity-0"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Footer note */}
            <div className="border-t bg-amber-50 px-4 py-2 text-center">
              <p className="text-xs text-amber-700">
                📖 এটি বইয়ের একটি নমুনা পূর্বরূপ। সম্পূর্ণ বই পড়তে কিনুন।
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
