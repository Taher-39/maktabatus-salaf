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
      <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">যোগাযোগ করুন</h3>
        <p className="mb-6 text-sm text-emerald-600">
          আপনার প্রশ্ন/প্রস্তাব আমাদের জানান। আমরা যত দ্রুত সম্ভব উত্তর দেব।
        </p>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-900">নাম</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-900">ইমেইল</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল"
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-900">বিষয় (ঐচ্ছিক)</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="যেমন: অর্ডার/প্রশ্ন"
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-emerald-900">বার্তা</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার বার্তা লিখুন"
              rows={5}
              className="w-full resize-none rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none"
            />
          </div>

          <button
            disabled={loading}
            className="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-emerald-900 disabled:opacity-60"
          >
            {loading ? "প্রসেসিং..." : "পাঠান"}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}
        </form>
      </div>
    </section>
  );
}

