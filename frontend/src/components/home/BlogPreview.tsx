"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/api";
import type { Blog } from "@/lib/api";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs({ limit: 3 })
      .then((res) => setBlogs(res.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  // Fallback posts
  const fallbackPosts = [
    {
      slug: "study-tips-for-students",
      title: "শিক্ষার্থীদের জন্য পড়ার কার্যকর কৌশল",
      excerpt: "সময় ব্যবস্থাপনা ও মনোযোগ বৃদ্ধি সম্পর্কিত গুরুত্বপূর্ণ টিপস।",
    },
    {
      slug: "importance-of-knowledge",
      title: "আল্লাহর জ্ঞানের গুরুত্ব",
      excerpt: "ইসলামী লেখকদের প্রাঞ্জল উপস্থাপনা।",
    },
    {
      slug: "building-habit-of-reading",
      title: "নিয়মিত পড়ার অভ্যাস গড়ে তোলা",
      excerpt: "কম সময়ে বেশি উপকার—কিভাবে পড়ার রুটিন বানাবেন।",
    },
  ];


  const posts = loading
    ? fallbackPosts
    : blogs.length > 0
      ? blogs.map((b) => ({
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt || b.content?.substring(0, 100) || "",
        }))
      : fallbackPosts;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-900">সাম্প্রতিক ব্লগ</h2>
        <Link href="/blog" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition">
          সব দেখুন →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-emerald-900">{p.title}</h3>
            <p className="mt-2 text-sm text-emerald-600 line-clamp-2">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}