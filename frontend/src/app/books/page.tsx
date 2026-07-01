"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import BookCard from "@/components/shared/BookCard";
import BookCardSkeleton from "@/components/shared/BookCardSkeleton";
import { getBooks, getCategories, getAuthors, getPublishers } from "@/lib/api";
import type { Book, BookQueryParams, Category, Author, Publisher } from "@/lib/types";
import { debounce } from "@/lib/utils";

type SortOption = BookQueryParams["sortBy"] | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "নতুন" },
  { value: "oldest", label: "পুরাতন" },
  { value: "price_asc", label: "দাম: কম→বেশি" },
  { value: "price_desc", label: "দাম: বেশি→কম" },
  { value: "name_asc", label: "নাম: আ-য" },
  { value: "name_desc", label: "নাম: য-আ" },
  { value: "popular_desc", label: "সর্বাধিক বিক্রিত" },
  { value: "popular_asc", label: "সর্বনিম্ন বিক্রিত" },
];

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-500">লোড হচ্ছে...</div>}>
      <BooksPageContent />
    </Suspense>
  );
}

function BooksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── URL-based state ─────────────────────────────────────────────────────
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialAuthor = searchParams.get("author") || "";
  const initialPublisher = searchParams.get("publisher") || "";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialSortBy = (searchParams.get("sortBy") as SortOption) || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [author, setAuthor] = useState(initialAuthor);
  const [publisher, setPublisher] = useState(initialPublisher);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy);
  const [page, setPage] = useState(initialPage);

  // ── Data from API ───────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  // ── UI state ────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // ── Load categories & authors once ──────────────────────────────────────
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
    getAuthors().then((res) => setAuthors(res.data)).catch(() => {});
    getPublishers().then((res) => setPublishers(res.data || [])).catch(() => {});
  }, []);

  // ── Sync URL params to state ───────────────────────────────────────────
  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
    setAuthor(initialAuthor);
    setPublisher(initialPublisher);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setSortBy(initialSortBy);
    setPage(initialPage);
  }, [
    initialSearch, initialCategory, initialAuthor, initialPublisher,
    initialMinPrice, initialMaxPrice, initialSortBy, initialPage,
  ]);

  // ── Build query + fetch books ───────────────────────────────────────────
  const queryParams = useMemo<BookQueryParams>(() => ({
    search: search || undefined,
    category: category || undefined,
    author: author || undefined,
    publisher: publisher || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy || "newest",
    page,
    limit: ITEMS_PER_PAGE,
  }), [search, category, author, publisher, minPrice, maxPrice, sortBy, page]);

  // Sync query to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (publisher) params.set("publisher", publisher);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/books${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, category, author, publisher, minPrice, maxPrice, sortBy, page, router]);

  // Fetch books
  useEffect(() => {
    setLoading(true);
    getBooks(queryParams)
      .then((res) => {
        setBooks(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalBooks(res.meta?.total || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
        setBooks([]);
      })
      .finally(() => setLoading(false));
  }, [queryParams]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const clearAllFilters = () => {
    setSearch("");
    setCategory("");
    setAuthor("");
    setPublisher("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters = !!(
    search || category || author || publisher || minPrice || maxPrice || sortBy !== "newest"
  );

  // ── Sidebar Filter Content (shared between desktop sidebar and mobile drawer) ──
  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">সার্চ</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="বইয়ের নাম লিখুন..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">ক্যাটাগরি</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">সব ক্যাটাগরি</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Author */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">লেখক</label>
        <select
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setPage(1); }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">সব লেখক</option>
          {authors.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Publisher */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">প্রকাশনা</label>
        <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => { setPublisher(""); setPage(1); }}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${publisher ? "border-gray-200 bg-white text-gray-700 hover:border-emerald-300" : "border-emerald-500 bg-emerald-50 text-emerald-700"}`}
          >
            সব প্রকাশনা
          </button>
          {publishers.map((pub) => (
            <button
              key={pub._id}
              type="button"
              onClick={() => { setPublisher(pub._id); setPage(1); }}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${publisher === pub._id ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"}`}
            >
              {pub.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <button
          type="button"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-700"
        >
          মূল্য সীমা
          {showMoreFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {showMoreFilters && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="সর্বনিম্ন"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="সর্বোচ্চ"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Sort */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">সাজানো</label>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          ফিল্টার রিসেট করুন
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">সকল বই</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "লোড হচ্ছে..." : `মোট ${totalBooks} টি বই পাওয়া গেছে`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 lg:hidden"
          >
            <FiFilter />
            ফিল্টার
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[10px] text-white">
                !
              </span>
            )}
          </button>

          {/* Desktop Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
            className="hidden rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none lg:block"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              সার্চ: &ldquo;{search}&rdquo;
              <button onClick={() => { setSearch(""); setPage(1); }} className="ml-1 hover:text-red-600">
                <FiX size={14} />
              </button>
            </span>
          )}
          {category && (() => {
            const cat = categories.find((c) => c._id === category);
            return cat ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                {cat.name}
                <button onClick={() => { setCategory(""); setPage(1); }} className="ml-1 hover:text-red-600">
                  <FiX size={14} />
                </button>
              </span>
            ) : null;
          })()}
          {author && (() => {
            const a = authors.find((au) => au._id === author);
            return a ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                {a.name}
                <button onClick={() => { setAuthor(""); setPage(1); }} className="ml-1 hover:text-red-600">
                  <FiX size={14} />
                </button>
              </span>
            ) : null;
          })()}
          {publisher && (() => {
            const pub = publishers.find((p) => p._id === publisher);
            return pub ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                {pub.name}
                <button onClick={() => { setPublisher(""); setPage(1); }} className="ml-1 hover:text-red-600">
                  <FiX size={14} />
                </button>
              </span>
            ) : null;
          })()}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              মূল্য: {minPrice ? `৳${minPrice}` : "০"} - {maxPrice ? `৳${maxPrice}` : "যেকোনো"}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }} className="ml-1 hover:text-red-600">
                <FiX size={14} />
              </button>
            </span>
          )}
          {sortBy !== "newest" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              <button onClick={() => { setSortBy("newest"); setPage(1); }} className="ml-1 hover:text-red-600">
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-800">ফিল্টার</h2>
            {filterContent}
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">ফিল্টার</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        {/* ── Books Grid ── */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl">📚</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-700">কোনো বই পাওয়া যায়নি</h3>
              <p className="mt-2 text-sm text-gray-500">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  ফিল্টার রিসেট করুন
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    আগে
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, and pages around current
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 2) return true;
                      return false;
                    })
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                            p === page
                              ? "bg-emerald-700 text-white shadow-sm"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    পরে
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}