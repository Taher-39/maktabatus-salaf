"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, socialLogin } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSocialLogin = async (providerName: "google" | "facebook") => {
    setLoading(true);
    setError("");
    try {
      const provider =
        providerName === "google"
          ? new GoogleAuthProvider()
          : new FacebookAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await socialLogin(idToken);
      if (res.success && res.data) {
        setAuth(
          {
            ...res.data
          },
          res.data.token
        );
        router.push(res.data.role === "admin" ? "/admin" : "/profile");
      }
    } catch (err: any) {
      setError(err.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const res = await login(email, password);
      if (res.success && res.data) {
        setAuth(
          {
            ...res.data
          },
          res.data.token
        );
        router.push(res.data.role === "admin" ? "/admin" : "/profile");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল ও পাসওয়ার্ড দিন।";
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
          <label className="mb-1 block text-sm font-medium">ইমেইল অ্যাড্রেস</label>
          <input
            name="email"
            type="email"
            required
            placeholder="example@gmail.com"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input
            name="password"
            type="password"
            required
            placeholder="******"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
          />
          <div className="mt-1 text-right">
            <Link href="/auth/forgot-password" className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
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

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative flex items-center justify-center py-2">
          <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></span>
          <span className="relative bg-white px-4 text-sm text-gray-500">অথবা</span>
        </div>

        <button
          onClick={() => handleSocialLogin("google")}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
          Google দিয়ে লগইন
        </button>

        <button
          onClick={() => handleSocialLogin("facebook")}
          disabled={loading}
          className="flex items-center justify-center gap-2 hidden rounded-lg bg-[#1877F2] py-2.5 text-sm font-medium text-white transition hover:bg-[#166fe5] disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="h-5 w-5" />
          Facebook দিয়ে লগইন
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/auth/register" className="text-emerald-700 hover:underline">
          রেজিস্টার করুন
        </Link>
      </p>
    </div>
  );
}