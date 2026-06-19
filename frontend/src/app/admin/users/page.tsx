"use client";

import Link from "next/link";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-emerald-900">ব্যবহারকারী পরিচালনা</h1>
      <p className="mb-6 text-gray-600">
        এখানে অ্যাডমিন ব্যবহারকারী তালিকা, ব্যান/আনবান এবং ডিলিট অপশন তৈরি করবেন।
      </p>
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <p className="text-gray-700">ব্যবহারকারী ম্যানেজমেন্ট UI এখানে থাকবে।</p>
      </div>
      <Link href="/admin" className="mt-6 inline-block text-emerald-700 hover:underline">
        ← অ্যাডমিন ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  );
}
