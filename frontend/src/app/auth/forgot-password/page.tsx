"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setMsg("আপনার ইমেইলে ওটিপি কোড পাঠানো হয়েছে! রিডাইরেক্ট হচ্ছে...");
        setIsSent(true);
        // ২ সেকেন্ড পর রিসেট পাসওয়ার্ড পেজে ইমেইলসহ রিডাইরেক্ট হবে
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-2 text-center text-2xl font-bold text-emerald-900">
        পাসওয়ার্ড ভুলে গেছেন?
      </h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        আপনার নিবন্ধিত ইমেইলটি দিন, আমরা আপনাকে পাসওয়ার্ড রিসেট করার ওটিপি পাঠাব।
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">ইমেইল অ্যাড্রেস</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="example@gmail.com"
            disabled={isSent}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
          />
        </div>

        {msg && (
          <p className={`rounded-lg p-3 text-sm text-center ${isSent ? "bg-green-50 text-emerald-600 border border-green-200" : "bg-red-50 text-red-600"}`}>
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || isSent}
          className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "প্রসেসিং..." : "ওটিপি কোড পাঠান"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        মনে পড়েছে? <Link href="/auth/login" className="text-emerald-700 hover:underline">লগইন করুন</Link>
      </p>
    </div>
  );
}