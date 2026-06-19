import Link from "next/link";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <h3 className="text-2xl font-bold text-emerald-900">শুরু করুন আজই</h3>
        <p className="max-w-xl text-sm text-emerald-600">স্বল্প সময়ে আপনার পছন্দের ইসলামিক বইগুলো অনলাইনে খুঁজে নিন ও অর্ডার করুন।</p>
        <div className="mt-3 flex gap-3">
          <Link href="/books" className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-emerald-900">বই দেখুন</Link>
          <Link href="/auth/login" className="rounded-lg border border-amber-400 px-6 py-3 font-semibold text-amber-400">লগইন</Link>
        </div>
      </div>
    </section>
  );
}
