"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { getBlogs, deleteBlog, Blog, BlogQueryParams } from "@/lib/api";
import { debounce } from "@/lib/utils";

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: BlogQueryParams = { page, limit: 10, status };
      if (search) params.search = search;
      const res = await getBlogs(params);
      setBlogs(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalBlogs(res.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত? এই ব্লগ ডিলিট হবে।")) return;
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      alert("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const getStatusBadge = (blog: Blog) => {
    if (blog.isPublished) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"><FiCheckCircle size={12} /> প্রকাশিত</span>;
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"><FiClock size={12} /> খসড়া</span>;
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">ব্লগ ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-1">মোট {totalBlogs} টি ব্লগ</p>
          </div>
          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <FiPlus size={18} /> নতুন ব্লগ
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ব্লগ সার্চ করুন..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="published">প্রকাশিত</option>
            <option value="draft">খসড়া</option>
          </select>
        </div>

        {/* Blog Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">শিরোনাম</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">লেখক</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">ভিউ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">লাইক</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">লোড হচ্ছে...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">কোনো ব্লগ পাওয়া যায়নি</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {blog.image && (
                          <img src={blog.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[250px]">{blog.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[250px]">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {typeof blog.author === "object" ? blog.author?.name || "N/A" : "N/A"}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">{getStatusBadge(blog)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{blog.views || 0}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{blog.likes || 0}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                          title="Preview"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/blogs/edit?id=${blog._id}`)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              আগে
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === page
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              পরে
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}