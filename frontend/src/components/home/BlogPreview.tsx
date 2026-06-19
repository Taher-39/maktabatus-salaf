import Link from "next/link";

const posts = [
  { slug: "study-tips-for-students", title: "শিক্ষার্থীদের জন্য পড়ার কার্যকর কৌশল", excerpt: "সময় ব্যবস্থাপনা ও মনোযোগ বৃদ্ধি সম্পর্কিত গুরুত্বপূর্ণ টিপস।" },
  { slug: "importance-of-knowledge", title: "আল্লাহর জ্ঞানের গুরুত্ব", excerpt: "ইসলামী লেখকদের প্রাঞ্জল উপস্থাপনা।" },
];

export default function BlogPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-emerald-900">সাম্প্রতিক ব্লগ</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-900">{p.title}</h3>
            <p className="mt-2 text-sm text-emerald-600">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
