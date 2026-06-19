"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const phone = form.get("phone") as string;
    const password = form.get("password") as string;

    try {
      const res = await login(phone, password);
      if (res.success && res.data) {
        setAuth(
          {
            _id: res.data._id,
            name: res.data.name,
            phone: res.data.phone,
            role: res.data.role,
          },
          res.data.token
        );
        router.push(res.data.role === "admin" ? "/admin" : "/profile");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "লগইন ব্যর্থ হয়েছে";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-6 text-center text-2xl font-bold text-emerald-900">
        লগইন
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">ফোন নম্বর</label>
          <input
            name="phone"
            required
            placeholder="01XXXXXXXXX"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/auth/register" className="text-emerald-700 hover:underline">
          রেজিস্টার করুন
        </Link>
      </p>
    </div>
  );
}
