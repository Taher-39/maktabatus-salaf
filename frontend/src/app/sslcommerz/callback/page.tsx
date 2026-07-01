"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SslCommerzCallbackContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Processing callback...");

  useEffect(() => {
    const rawStatus =
      searchParams.get("status") ||
      searchParams.get("status_code") ||
      searchParams.get("payment_status") ||
      "received";

    setMessage(`Callback received. Status: ${rawStatus}`);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-indigo-900">SSLCOMMERZ Callback</h1>
      <p className="mt-4 text-gray-600">{message}</p>
      <p className="mt-6 text-xs text-gray-400">
        আপনি পেমেন্ট সম্পন্ন করার পর সফল/ব্যর্থ পেজে রিডাইরেক্ট হবেন।
      </p>
    </div>
  );
}

export default function SslCommerzCallbackPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Processing callback...</div>}>
      <SslCommerzCallbackContent />
    </Suspense>
  );
}

