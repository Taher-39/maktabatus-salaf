"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/api";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await changePassword({ oldPassword, newPassword });
      if (res.success) {
        setIsSuccess(true);
        setMsg("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // ৩ সেকেন্ড পর প্রোফাইল পেজে ব্যাক করবে
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "পাসওয়ার্ড পরিবর্তনে ব্যর্থতা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-2 text-center text-2xl font-bold text-emerald-900">
        পাসওয়ার্ড পরিবর্তন করুন
      </h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে বর্তমান পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট করুন।
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">বর্তমান পাসওয়ার্ড</label>
          <input
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
            required
            placeholder="******"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
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
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="******"
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
          disabled={loading}
          className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition"
        >
          {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
        </button>
      </form>
    </div>
    </DashboardLayout>
  );
}