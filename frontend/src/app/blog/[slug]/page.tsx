"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
            .catch(console.error);
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
    <article className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:py-10">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-emerald-700"
      >
        <FiArrowLeft size={16} /> ব্লগে ফিরে যান
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 lg:p-8">
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

          {blog.image && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <Image
                src={blog.image}
                alt={blog.title}
                width={800}
                height={420}
                className="w-full h-auto max-h-[420px] object-cover"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <strong>সংক্ষিপ্তসার:</strong> {blog.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-emerald max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 prose-a:text-emerald-700 w-full break-words whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
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

          {relatedBlogs.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">সম্পর্কিত ব্লগ</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedBlogs.map((rb) => (
                  <Link
                    key={rb._id}
                    href={`/blog/${rb.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    {rb.image && (
                      <div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={rb.image}
                          alt={rb.title}
                          width={300}
                          height={169}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                      {rb.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-500">{rb.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <h3 className="text-lg font-semibold text-emerald-900">এই ব্লগটি কেমন?</h3>
            <p className="mt-2 text-sm text-emerald-700">আপনার মূল্যবান মন্তব্য ও পরামর্শ আমাদের আরও ভালো কনটেন্ট তৈরি করতে সাহায্য করবে।</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">দ্রুত লিংক</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <Link href="/books" className="block hover:text-emerald-700">সকল বই</Link>
              <Link href="/blog" className="block hover:text-emerald-700">সমস্ত ব্লগ</Link>
              <Link href="/contact" className="block hover:text-emerald-700">যোগাযোগ</Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}