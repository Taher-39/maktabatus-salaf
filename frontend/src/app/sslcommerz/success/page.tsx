"use client";

import { useSearchParams } from "next/navigation";

export default function SslCommerzSuccessPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "success";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-emerald-900">
        SSLCOMMERZ Success
      </h1>
      <p className="mt-4 text-gray-600">
        পেমেন্ট সফল হয়েছে।
      </p>
      <p className="mt-6 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
        Status: {status}
      </p>
    </div>
  );
}

