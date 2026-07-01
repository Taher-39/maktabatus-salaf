"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiImage } from "react-icons/fi";
import DashboardLayout from "@/components/admin/DashboardLayout";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { createBlog } from "@/lib/api";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim() || !category.trim()) {
      setError("সব ফিল্ড পূরণ করুন");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const slug = title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        slug,
        content,
        category: category.trim(),
        isPublished,
      };
      await createBlog(payload);
      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err?.response?.data?.message || "ব্লগ তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">নতুন ব্লগ</h1>
            <p className="text-sm text-gray-500">একটি নতুন ব্লগ পোস্ট তৈরি করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">শিরোনাম *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ব্লগের শিরোনাম লিখুন"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">ক্যাটাগরি *</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="যেমন: ইসলামিক জ্ঞান, কুরআন, হাদিস"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">সংক্ষিপ্ত বিবরণ *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="ব্লগের একটি সংক্ষিপ্ত বিবরণ দিন"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">বিস্তারিত কন্টেন্ট *</label>
            <RichTextEditor value={content} onChange={setContent} minHeight="300px" />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300">প্রকাশিত</span>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              <FiSave size={16} />
              {submitting ? "সাবমিট হচ্ছে..." : "ব্লগ তৈরি করুন"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
