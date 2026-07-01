"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEdit3, FiPlus, FiTrash2, FiEye, FiUsers } from "react-icons/fi";
import DashboardLayout from "@/components/admin/DashboardLayout";
import BlogModal, { type BlogDraft } from "@/components/admin/BlogModal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { deleteBlog, getBlogs, likeBlog, createBlog, getBlogById, updateBlog } from "@/lib/api";

export type AdminBlog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  likes: number;
  views: number;
  category?: string;
  isPublished?: boolean;
  createdAt: string;
};

export default function AdminBlogsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);

  const [tab, setTab] = useState<"published" | "draft" | "all">("published");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalInitial, setModalInitial] = useState<Partial<BlogDraft> | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    return {
      status: tab === "all" ? "all" : tab,
      sortBy: "newest" as const,
      limit: 50,
      page: 1,
    };
  }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBlogs(query as any);
      setBlogs((res?.data || []) as any);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setModalInitial({ isPublished: tab === "published" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = async (id: string) => {
    setModalMode("edit");
    setEditingId(id);
    setError("");
    setSubmitting(false);
    try {
      const res = await getBlogById(id);
      const b = res.data as any;
      setModalInitial({
        title: b.title,
        excerpt: b.excerpt || "",
        content: b.content || "",
        category: b.category || "",
        isPublished: b.isPublished !== false,
      });
    } catch {
      setModalInitial(undefined);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (draft: BlogDraft) => {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      if (modalMode === "create") {
        await createBlog({
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          content: draft.content,
          category: draft.category.trim(),
          isPublished: draft.isPublished,
          // image omitted (backend upload handled elsewhere)
        } as any);
      } else {
        if (!editingId) throw new Error("Missing blog id");
        await updateBlog(editingId, {
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          content: draft.content,
          category: draft.category.trim(),
          isPublished: draft.isPublished,
        } as any);
      }

      setModalOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("এই ব্লগটি ডিলিট করবেন?");
    if (!ok) return;
    setSubmitting(true);
    setError("");
    try {
      await deleteBlog(id);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "ডিলিট করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ব্লগ ম্যানেজমেন্ট</h1>
            <p className="text-sm text-gray-500">
              Create / Edit / Delete 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <FiEye />
              <span>দ্রুত কাজ</span>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              <FiPlus size={16} />
              নতুন ব্লগ
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {(
            [
              { key: "published", label: "প্রকাশিত" },
              { key: "draft", label: "ড্রাফট" },
              { key: "all", label: "সব" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white dark:bg-gray-900 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">কোনো ব্লগ নেই</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">শিরোনাম</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">ক্যাটাগরি</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">স্ট্যাটাস</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">ভিউ</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">লাইক</th>
                  <th className="pb-3 font-semibold text-gray-600 dark:text-gray-300">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40"
                  >
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {b.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{b.excerpt}</div>
                    </td>
                    <td className="py-4 pr-4 text-gray-700 dark:text-gray-200">{b.category || "—"}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          b.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {b.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-gray-700 dark:text-gray-200">{b.views || 0}</td>
                    <td className="py-4 pr-4 text-gray-700 dark:text-gray-200">{b.likes || 0}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <FiEye className="inline-block mr-1" />
                          View
                        </Link>
                        <button
                          onClick={() => openEdit(b._id)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                          <FiEdit3 className="inline-block mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/10"
                          disabled={submitting}
                        >
                          <FiTrash2 className="inline-block mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}

        <BlogModal
          open={modalOpen}
          mode={modalMode}
          initial={modalInitial}
          submitting={submitting}
          error={error}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}

