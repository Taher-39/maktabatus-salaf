"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/shared/BookCard";
import BookCardSkeleton from "@/components/shared/BookCardSkeleton";
import { getNewBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

const skeletons = Array.from({ length: 4 }, (_, index) => index);

export default function NewBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewBooks()
      .then((res) => setBooks(res.data || []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold text-emerald-900">নতুন বই</h2>
        <p className="max-w-xl text-sm text-emerald-600">
          নতুন প্রকাশের বইগুলো প্রথম দেখুন এবং আজই অর্ডার করুন।
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
