"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookGallery from "@/components/product/BookGallery";
import ShareButtons from "@/components/product/ShareButtons";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getBookBySlug } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import type { Book } from "@/lib/types";
import { formatPrice, getAuthorName, getCategoryName } from "@/lib/utils";

export default function BookDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!slug) return;
    getBookBySlug(slug)
      .then((res) => setBook(res.data))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (!book) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">বই পাওয়া যায়নি</p>
      </div>
    );
  }

  const authorName = getAuthorName(book.author);
  const categoryName = getCategoryName(book.category);
  const inStock = book.stock > 0;

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(book);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <BookGallery
          coverImage={book.coverImage}
          title={book.title}
          previewPages={book.previewPages}
        />

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">
            {book.title}
          </h1>
          {authorName && (
            <p className="mt-2 text-gray-600">লেখক: {authorName}</p>
          )}
          {categoryName && (
            <p className="text-sm text-gray-500">ক্যাটাগরি: {categoryName}</p>
          )}

          <p className="mt-4 text-3xl font-bold text-amber-600">
            {formatPrice(book.price)}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {inStock ? `${book.stock} টি স্টকে আছে` : "স্টক শেষ"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-emerald-900 transition hover:bg-amber-400 disabled:opacity-50 sm:flex-none"
            >
              এখনই কিনুন
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 rounded-lg border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 sm:flex-none"
            >
              {added ? "✓ কার্টে যোগ হয়েছে" : "কার্টে যোগ করুন"}
            </button>
          </div>

          <div className="mt-6">
            <ShareButtons url={`/books/${book.slug}`} title={book.title} />
          </div>

          {book.description && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-emerald-900">বিবরণ</h2>
              <p className="leading-relaxed text-gray-700">{book.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
