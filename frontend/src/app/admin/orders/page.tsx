"use client";

import Link from "next/link";
import OrdersTable from "@/components/admin/orders/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-emerald-900">অর্ডার তালিকা</h1>
      <p className="mb-6 text-gray-600">
        এখানে অর্ডার লিস্ট, paymentStatus, tran_id এবং paymentProof দেখা যাবে।
      </p>

      <OrdersTable />

      <Link
        href="/admin"
        className="mt-6 inline-block text-sm text-emerald-700 hover:underline"
      >
        ← অ্যাডমিন ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  );
}

