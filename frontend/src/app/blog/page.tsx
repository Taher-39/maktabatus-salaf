"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiClock, FiEye, FiHeart } from "react-icons/fi";
import { getBlogs, Blog, BlogQueryParams } from "@/lib/api";
import { debounce } from "@/lib/utils";

const BLOGS_PER_PAGE = 9;

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "নতুন" },
  { value: "oldest", label: "পুরাতন" },
  { value: "views_desc", label: "সর্বাধিক পঠিত" },
  { value: "likes_desc", label: "সর্বাধিক পছন্দ" },
];

export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sortBy") || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [page, setPage] = useState(initialPage);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Build query
  const queryParams = useMemo<BlogQueryParams>(() => ({
    search: search || undefined,
    sortBy: sortBy as any,
    page,
    limit: BLOGS_PER_PAGE,
  }), [search, sortBy, page]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/blog${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, sortBy, page, router]);

  // Fetch
  useEffect(() => {
    setLoading(true);
    getBlogs(queryParams)
      .then((res) => {
        setBlogs(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalBlogs(res.meta?.total || 0);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [queryParams]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("bn-BD", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-900">ব্লগ</h1>
        <p className="mt-2 text-gray-500">
          {loading ? "লোড হচ্ছে..." : `মোট ${totalBlogs} টি ব্লগ পাওয়া গেছে`}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ব্লগ সার্চ করুন..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 h-40 rounded-lg bg-gray-200" />
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700">কোনো ব্লগ পাওয়া যায়নি</h3>
          <p className="mt-2 text-sm text-gray-500">অন্য কিওয়ার্ড দিয়ে সার্চ করুন</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md overflow-hidden"
              >
                {blog.image && (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  {blog.category && (
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 mb-2">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition">
                    {blog.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {blog.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {formatDate(blog.createdAt)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiEye size={14} />
                        {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHeart size={14} />
                        {blog.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                আগে
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
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
  );
}