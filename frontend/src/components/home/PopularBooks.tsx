"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/shared/BookCard";
import BookCardSkeleton from "@/components/shared/BookCardSkeleton";
import { getPopularBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

const skeletons = Array.from({ length: 4 }, (_, index) => index);

export default function PopularBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularBooks()
      .then((res) => setBooks(res.data || []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold text-emerald-900">জনপ্রিয় বই</h2>
        <p className="max-w-xl text-sm text-emerald-600">
          গ্রাহকের পছন্দের বইগুলো এখন চেক করে নিন এবং সরাসরি অর্ডার করুন।
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? skeletons.map((index) => <BookCardSkeleton key={index} />)
          : books.map((book) => <BookCard key={book._id} book={book} />)}
      </div>
    </section>
  );
}
