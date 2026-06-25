"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBooks } from "@/lib/api";
import { Book } from "@/lib/types";
import BookCard from "@/components/shared/BookCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getBooks({ category: id })
      .then((res) => setBooks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-900 mb-8">ক্যাটাগরির বইসমূহ</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </main>
  );
}
