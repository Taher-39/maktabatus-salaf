"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendOtp, register } from "../../../lib/api"; 

export default function RegisterPage() {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ১ম ধাপ: ওটিপি রিকোয়েস্ট করা
  const handleSendOtp = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setMsg("অনুগ্রহ করে ওটিপি পাঠানোর আগে সব ঘর পূরণ করুন।");
      return;
    }
    if (password !== confirmPassword) {
      setMsg("পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      const res = await sendOtp(email, name);
      if (res.success) {
        setIsOtpSent(true);
        setMsg("আপনার ইমেইলে একটি ৬ ডিজিটের ওটিপি পাঠানো হয়েছে!");
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "ওটিপি পাঠাতে ব্যর্থ। সঠিক ইমেইল দিন।");
    } finally { setLoading(false); }
  };

  // ২য় ধাপ: ওটিপি দিয়ে সম্পূর্ণ সাইন আপ সাবমিট
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMsg("অনুগ্রহ করে ওটিপি কোডটি দিন।");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await register({ email, name, password, otp });

      if (res.success) {
        setMsg("রেজিস্ট্রেশন সফল হয়েছে! ২ সেকেন্ড পর লগইন পেজে নিয়ে যাওয়া হচ্ছে...");
        setTimeout(() => { router.push("/auth/login"); }, 2000);
      }
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "ভুল ওটিপি কোড দিয়েছেন বা ওটিপি এক্সপায়ার হয়েছে।");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md p-6 my-10">
      <h1 className="text-2xl font-bold text-center mb-6">রেজিস্টার (OTP ভেরিফিকেশন)</h1>

      <form onSubmit={handleRegisterSubmit} className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">নাম</label>
          <input  
            value={name}  
            onChange={e => setName(e.target.value)}  
            placeholder="নাম"  
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"  
            disabled={isOtpSent}
            required  
          />
        </div> 
        <div>
          <label className="mb-1 block text-sm font-medium">ইমেইল অ্যাড্রেস</label>
          <input  
            value={email}  
            onChange={e => setEmail(e.target.value)}  
            placeholder="ইমেইল (example@gmail.com)"  
            type="email"
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"  
            disabled={isOtpSent}
            required  
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input  
            value={password}  
            onChange={e => setPassword(e.target.value)}  
            placeholder="পাসওয়ার্ড"  
            type="password"  
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"  
            disabled={isOtpSent}
            required  
          />
        </div>
        <div>
        <label className="mb-1 block text-sm font-medium">কনফার্ম পাসওয়ার্ড</label>
        <input  
          value={confirmPassword}  
          onChange={e => setConfirmPassword(e.target.value)}  
          placeholder="কনফার্ম পাসওয়ার্ড"  
          type="password"  
          className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"  
          disabled={isOtpSent}
          required  
        />
        </div>
        {/* ওটিপি বক্স কেবল মেইল পাঠানোর পর আসবে */}
        {isOtpSent && (
          <input  
            value={otp}  
            onChange={e => setOtp(e.target.value)}  
            placeholder="৬ ডিজিটের ওটিপি কোড দিন"  
            type="text"  
            maxLength={6}
            className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none tracking-widest"  
            required  
          />
        )}

        {/* বাটন কন্ডিশনাল রেন্ডারিং */}
        {!isOtpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "ওটিপি পাঠানো হচ্ছে..." : "ইমেইলে ওটিপি পাঠান"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "ভেরিফাই হচ্ছে..." : "কোড ভেরিফাই ও রেজিস্টার করুন"}
          </button>
        )}

        {msg && (
          <p className={`text-sm mt-2 p-2 rounded text-center ${msg.includes("সফল") || msg.includes("পাঠানো") ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            {msg}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/auth/login" className="text-emerald-700 hover:underline">লগইন করুন</Link>
        </p>
      </form>
    </div>
  );
}