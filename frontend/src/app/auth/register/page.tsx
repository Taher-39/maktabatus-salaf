"use client";

import { useState } from "react";
import Link from "next/link";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return (window as any).recaptchaVerifier;
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth, 
      "recaptcha-container",
      { size: "invisible" }
    );
    return (window as any).recaptchaVerifier;
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      setMsg("");
      const verifier = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(confirmationResult);
      setMsg("OTP পাঠানো হয়েছে, কোড দিন।");
    } catch (err: any) {
      setMsg(err?.message || "OTP পাঠাতে সমস্যা হয়েছে");
    } finally { setLoading(false); }
  };

  const confirmOtpAndRegister = async () => {
    if (!confirmation) return setMsg("OTP পাঠান প্রথমে");
    try {
      setLoading(true);
      const result = await confirmation.confirm(code);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken, name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "রেজিস্ট্রেশন ব্যর্থ");
      setMsg("রেজিস্ট্রেশন সফল");
    } catch (err: any) {
      setMsg(err?.message || "রেজিস্ট্রেশনে সমস্যা হয়েছে");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">রেজিস্টার</h1>

      <div className="mt-4 flex flex-col gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="নাম" className="border p-2 rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="পাসওয়ার্ড" type="password" className="border p-2 rounded" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+8801700000000" className="border p-2 rounded" />
        <div id="recaptcha-container"></div>

        {!confirmation ? (
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            OTP পাঠান
          </button>
        ) : (
          <>
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="OTP কোড" className="border p-2 rounded" />
            <button
              type="button"
              onClick={confirmOtpAndRegister}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              রেজিস্টার
            </button>
          </>
        )}

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <p className="mt-4 text-sm text-gray-600">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/auth/login" className="text-emerald-700 hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
