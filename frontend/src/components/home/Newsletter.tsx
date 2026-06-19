"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("একটি বৈধ ইমেইল দিন");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("আপনি সফলভাবে নিউজলেটারে সাইন আপ করেছেন।");
      setEmail("");
    }, 900);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">নিউজলেটার</h3>
        <p className="mb-4 text-sm text-emerald-600">অফার, নতুন প্রকাশনা ও সংবাদপত্রের জন্য সাবস্ক্রাইব করুন।</p>

        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only">ইমেইল</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="আপনার ইমেইল লিখুন"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none"
            aria-label="ইমেইল"
          />
          <button
            disabled={loading}
            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-emerald-900 disabled:opacity-60"
          >
            {loading ? "প্রসেসিং..." : "সাবস্ক্রাইব"}
          </button>
        </form>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-2 text-sm text-emerald-700">{success}</p>}
      </div>
    </section>
  );
}
