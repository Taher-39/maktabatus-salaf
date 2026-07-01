"use client";

import { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("একটি বৈধ ইমেইল দিন");
      return;
    }
    if (message.trim().length < 10) {
      setError("বার্তাটি অন্তত ১০ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Failed to send email");
        return;
      }

      setSuccess("আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("ইমেইল পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Contact us</p>
            <h3 className="mt-3 text-3xl font-bold">আপনার প্রশ্ন বা অর্ডারের তথ্য আমাদের জানান</h3>
            <p className="mt-4 text-sm leading-7 text-emerald-100">
              বই, ডেলিভারি বা পেমেন্টের যেকোনো প্রশ্নের উত্তর পেতে সরাসরি লিখুন। আমরা সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করি।
            </p>
            <div className="mt-8 space-y-3 text-sm text-emerald-50">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">📞 +880 1407-021847</div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">✉️ maktabatussalaf47@gmail.com</div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">📍 রাজশাহী, বাংলাদেশ</div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-900">নাম</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full rounded-lg border border-emerald-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-900">ইমেইল</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল"
                  className="w-full rounded-lg border border-emerald-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-900">বিষয় (ঐচ্ছিক)</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="যেমন: অর্ডার/প্রশ্ন"
                  className="w-full rounded-lg border border-emerald-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-emerald-900">বার্তা</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার বার্তা লিখুন"
                  rows={5}
                  className="w-full resize-none rounded-lg border border-emerald-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-emerald-900 transition hover:bg-amber-400 disabled:opacity-60"
              >
                {loading ? "প্রসেসিং..." : "পাঠান"}
              </button>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-emerald-700">{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

