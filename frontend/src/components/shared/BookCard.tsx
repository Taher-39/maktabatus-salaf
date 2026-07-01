"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Book } from "@/lib/types";
import { formatPrice, getAuthorName, getCategoryName } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const authorName = getAuthorName(book.author);
  const categoryName = getCategoryName(book.category);
  const inStock = book.stock > 0;

  const handleOrderNow = () => {
    if (!inStock) return;
    addItem(book);
    router.push("/checkout");
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-emerald-100 bg-white shadow-sm"
    >
      <Link href={`/books/${book.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-emerald-50">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-emerald-300">
              <span className="text-4xl">📚</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
            <div className="text-xs uppercase tracking-[0.15em] text-amber-300">{categoryName || "বই"}</div>
          </div>
          {book.stock <= 0 && (
            <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              স্টক শেষ
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-emerald-900 group-hover:text-emerald-700">
            {book.title}
          </h3>
          {authorName && (
            <p className="text-xs text-emerald-500">লেখক: {authorName}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-600">
            <span>ভিউ: {book.viewCount || 0}</span>
            <span>বিক্রি: {book.soldCount || 0}</span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <p className="text-sm font-bold text-amber-600">{formatPrice(book.price)}</p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">
              {inStock ? "স্টক আছে" : "স্টক নেই"}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleOrderNow}
        disabled={!inStock}
        className="mx-3 mb-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        অর্ডার করুন
      </button>
    </motion.div>
  );
}
