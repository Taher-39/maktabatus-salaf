"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SslCommerzFailContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "fail";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-700">SSLCOMMERZ Fail</h1>
      <p className="mt-4 text-gray-600">পেমেন্ট ব্যর্থ হয়েছে।</p>
      <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">Status: {status}</p>
    </div>
  );
}

export default function SslCommerzFailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading payment result...</div>}>
      <SslCommerzFailContent />
    </Suspense>
  );
}

