"use client";

import { useEffect, useState } from "react";
import { getBooks } from "@/lib/api";

export default function Stats() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks({ limit: 1 })
      .then((res) => {
        setTotalBooks(res.meta?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "মোট বই", value: loading ? "..." : totalBooks.toLocaleString("bn-BD") },
    { label: "সক্রিয় গ্রাহক", value: "৫০০০+" },
    { label: "মোট অর্ডার", value: "৮০০০+" },
    { label: "সন্তুষ্ট গ্রাহক", value: "৯৯%" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-900">{s.value}</div>
            <div className="mt-1 text-sm text-emerald-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}