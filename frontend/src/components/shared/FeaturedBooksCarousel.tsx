"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getBooks } from "@/lib/api";
import type { Book } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  /**
   * compact  → book details page top-right (ছোট, ভার্টিক্যাল লিস্ট)
   * full     → home/cart/checkout (বড়, হরিজন্টাল স্লাইডার)
   */
  variant?: "compact" | "full";
  excludeId?: string; // current book বাদ দিতে
}

const AUTO_SLIDE_INTERVAL = 3000; // 3 সেকেন্ড

export default function FeaturedBooksCarousel({
  variant = "full",
  excludeId,
}: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Visible count per variant ────────────────────────────────────────────────
  const visibleCount = variant === "compact" ? 3 : 4;

  // ── Fetch featured books ─────────────────────────────────────────────────────
  useEffect(() => {
    getBooks({ sortBy: "popular", limit: 12 })
      .then((res) => {
        const filtered = excludeId
          ? res.data.filter((b) => b._id !== excludeId)
          : res.data;
        setBooks(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [excludeId]);

  // ── Auto-slide ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (books.length <= visibleCount) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) =>
        prev + 1 > books.length - visibleCount ? 0 : prev + 1
      );
    }, AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [books.length, visibleCount]);

  const goTo = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(index);
  };

  const prev = () =>
    goTo(current === 0 ? Math.max(0, books.length - visibleCount) : current - 1);
  const next = () =>
    goTo(current + 1 > books.length - visibleCount ? 0 : current + 1);

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-gray-100 rounded-xl ${
          variant === "compact" ? "h-48" : "h-40"
        }`}
      />
    );
  }

  if (books.length === 0) return null;

  // ════════════════════════════════════════════════════════════════════════════
  // COMPACT variant — book details page top-right
  // ════════════════════════════════════════════════════════════════════════════
  if (variant === "compact") {
    const visible = books.slice(current, current + visibleCount);
    return (
      <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            জনপ্রিয় বইসমূহ
          </p>
          <div className="flex gap-1">
            <button
              onClick={prev}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs"
            >
              ›
            </button>
          </div>
        </div>

        {/* Book list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-2"
          >
            {visible.map((book) => (
              <Link
                key={book._id}
                href={`/books/${book.slug}`}
                className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm transition hover:shadow-md hover:border-emerald-200 border border-transparent"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-12 w-9 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold text-gray-800">
                    {book.title}
                  </p>
                  <p className="text-xs font-bold text-amber-600">
                    {formatPrice(book.price)}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {books.length > visibleCount && (
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({
              length: books.length - visibleCount + 1,
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-4 bg-emerald-600"
                    : "w-1.5 bg-emerald-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FULL variant — home/cart/checkout
  // ════════════════════════════════════════════════════════════════════════════
  const visible = books.slice(current, current + visibleCount);

  return (
    <section className="my-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-emerald-900 border-b-2 border-amber-400 pb-1">
          জনপ্রিয় বইসমূহ
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={current >= books.length - visibleCount}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 transition"
          >
            ›
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {visible.map((book) => (
              <Link
                key={book._id}
                href={`/books/${book.slug}`}
                className="group rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <h3 className="line-clamp-2 text-xs font-semibold text-gray-800 group-hover:text-emerald-700">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm font-bold text-amber-600">
                  {formatPrice(book.price)}
                </p>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {books.length > visibleCount && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: books.length - visibleCount + 1 }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-5 bg-emerald-600" : "w-2 bg-gray-300"
                }`}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
