"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // ইউআরএল (URL) থেকে ইমেইল কুয়েরি প্যারামিটার রিড করা
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await resetPassword({ email, otp, newPassword });
      if (res.success) {
        setIsSuccess(true);
        setMsg("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! লগইন করুন।");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2500);
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "ভুল ওটিপি কোড অথবা ওটিপি এক্সপায়ার হয়ে গেছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-2 text-center text-2xl font-bold text-emerald-900">
        নতুন পাসওয়ার্ড সেট করুন
      </h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        আপনার ইমেইলে প্রেরিত ৬ ডিজিটের ওটিপি কোড এবং নতুন পাসওয়ার্ডটি দিন।
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
            disabled={!!searchParams.get("email") || isSuccess}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 bg-gray-50 focus:border-emerald-500 focus:outline-none disabled:opacity-70"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">৬ ডিজিটের ওটিপি (OTP)</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            required
            maxLength={6}
            placeholder="123456"
            disabled={isSuccess}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 text-center font-bold tracking-widest focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">নতুন পাসওয়ার্ড</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            required
            placeholder="******"
            disabled={isSuccess}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">কনফার্ম নতুন পাসওয়ার্ড</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="******"
            disabled={isSuccess}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {msg && (
          <p className={`rounded-lg p-3 text-sm text-center ${isSuccess ? "bg-green-50 text-emerald-600 border border-green-200" : "bg-red-50 text-red-600"}`}>
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || isSuccess}
          className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        <Link href="/auth/login" className="text-emerald-700 hover:underline">লগইন পেজে ফিরে যান</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    // Next.js static generation এরর এড়াতে useSearchParams কে Suspense এ মুড়িয়ে দেওয়া হলো
    <Suspense fallback={<div className="text-center py-12">লোড হচ্ছে...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}