"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getMyOrders } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import DashboardLayout from "@/components/admin/DashboardLayout";

const statusLabels: Record<string, string> = {
  pending: "অপেক্ষমান",
  processing: 'প্রক্রিয়াধীন',
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল করা হয়েছে",
};

const paymentLabels: Record<string, string> = {
  pending: "পেমেন্ট অপেক্ষমান",
  approved: "পেমেন্ট অনুমোদিত",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    getMyOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout>
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-900">আমার অর্ডার</h1>

      {orders.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          এখনো কোনো অর্ডার নেই
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-emerald-900">
                    {order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </p>
                  <p className="text-xs text-gray-500">
                    {paymentLabels[order.paymentStatus] || order.paymentStatus}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {order.items.length} টি বই
              </p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/"
        className="mt-6 inline-block text-sm text-emerald-700 hover:underline"
      >
        ← হোমে ফিরুন
      </Link>
    </div>
    </DashboardLayout>
  );
}
