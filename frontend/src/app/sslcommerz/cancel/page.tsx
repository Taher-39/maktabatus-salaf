"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SslCommerzCancelContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "cancel";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-amber-700">SSLCOMMERZ Cancelled</h1>
      <p className="mt-4 text-gray-600">আপনি পেমেন্ট বাতিল করেছেন।</p>
      <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Status: {status}</p>
    </div>
  );
}

export default function SslCommerzCancelPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading payment result...</div>}>
      <SslCommerzCancelContent />
    </Suspense>
  );
}

