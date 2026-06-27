"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiEye, FiHeart, FiCalendar } from "react-icons/fi";
import { getBlogBySlug, likeBlog, getBlogs } from "@/lib/api";
import type { Blog } from "@/lib/api";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogBySlug(slug)
      .then((res) => {
        const b = res.data;
        setBlog(b);
        // Get related blogs of same category
        if (b.category) {
          getBlogs({ category: b.category, limit: 3, sortBy: "newest" })
            .then((relRes) => {
              setRelatedBlogs(
                relRes.data?.filter((x: Blog) => x._id !== b._id).slice(0, 3) || []
              );
            })
            .catch(() => {});
        }
      })
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!blog) return;
    try {
      await likeBlog(blog._id);
      setBlog((prev) => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("bn-BD", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">ব্লগ পাওয়া যায়নি</p>
        <Link href="/blog" className="mt-4 inline-block text-emerald-700 hover:underline">ব্লগে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 mb-6"
      >
        <FiArrowLeft size={16} /> ব্লগে ফিরে যান
      </Link>

      {/* Header */}
      <header className="mb-8">
        {blog.category && (
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3">
            {blog.category}
          </span>
        )}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
          {blog.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={15} />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <FiEye size={15} />
            {blog.views || 0} বার দেখা
          </span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition"
          >
            <FiHeart size={15} />
            {blog.likes || 0} পছন্দ
          </button>
          {typeof blog.author === "object" && blog.author?.name && (
            <span>লেখক: {blog.author.name}</span>
          )}
        </div>
      </header>

      {/* Image */}
      {blog.image && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Excerpt */}
      {blog.excerpt && (
        <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">
          <strong>সংক্ষিপ্তসার:</strong> {blog.excerpt}
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-emerald max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 prose-a:text-emerald-700"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags / Share */}
      <div className="mt-10 flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200">
        <span className="text-sm font-semibold text-gray-600">শেয়ার করুন:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(blog.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-200"
        >
          Twitter
        </a>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত ব্লগ</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedBlogs.map((rb) => (
              <Link
                key={rb._id}
                href={`/blog/${rb.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {rb.image && (
                  <div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={rb.image}
                      alt={rb.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                  {rb.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                  {rb.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}