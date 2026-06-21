"use client";

import { useCallback, useEffect, useState } from "react";
import BookCard from "@/components/shared/BookCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getBooks, getCategories } from "@/lib/api";
import type { Book, Category } from "@/lib/types";
import { debounce } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "নতুন" },
  { value: "oldest", label: "পুরাতন" },
  { value: "price_asc", label: "দাম: কম থেকে বেশি" },
  { value: "price_desc", label: "দাম: বেশি থেকে কম" },
  { value: "popular_desc", label: "জনপ্রিয়" },
  { value: "name_asc", label: "নাম: A-Z" },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBooks({
        search: search || undefined,
        category: category || undefined,
        sortBy,
        page,
        limit: 12,
      });
      setBooks(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, page]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 400),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
        সকল বই
      </h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="বই খুঁজুন..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="flex-1 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-500 focus:outline-none dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:placeholder:text-emerald-500"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-900 focus:border-emerald-500 focus:outline-none dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100"
        >
          <option value="">সকল ক্যাটাগরি</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-900 focus:border-emerald-500 focus:outline-none dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-emerald-300">
          কোনো বই পাওয়া যায়নি
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-40 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900"
              >
                আগে
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-emerald-300">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-40 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900"
              >
                পরে
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
