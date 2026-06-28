"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  pending: "অপেক্ষমান",
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল",
};

const paymentLabels: Record<string, string> = {
  pending: "পেমেন্ট অপেক্ষমান",
  approved: "পেমেন্ট অনুমোদিত",
};


export default function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialId) {
      setLoading(true);
      trackOrder(initialId)
        .then((res) => setOrder(res.data))
        .catch(() => setError("অর্ডার পাওয়া যায়নি"))
        .finally(() => setLoading(false));
    }
  }, [initialId]);

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await trackOrder(orderId.trim());
      setOrder(res.data);
    } catch {
      setError("অর্ডার পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-900">
        অর্ডার ট্র্যাক
      </h1>

      <form onSubmit={handleTrack} className="flex gap-3">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="অর্ডার আইডি (যেমন: MS-00001)"
          className="flex-1 rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-6 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {loading ? "..." : "ট্র্যাক"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">অর্ডার আইডি</p>
              <p className="text-lg font-bold text-emerald-900">
                {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">অর্ডার স্ট্যাটাস</p>
              <p className="font-semibold">
                {statusLabels[order.orderStatus] || order.orderStatus}
              </p>

              <div className="mt-2">
                <p className="text-sm text-gray-500">পেমেন্ট স্ট্যাটাস</p>
                <p className="font-semibold">
                  {paymentLabels[order.paymentStatus] || order.paymentStatus}
                </p>
              </div>
            </div>

          </div>

          <div className="space-y-2 border-t pt-4">
            <p>
              <span className="text-gray-500">নাম:</span> {order.name}
            </p>
            <p>
              <span className="text-gray-500">ফোন:</span> {order.phone}
            </p>
            <p>
              <span className="text-gray-500">ঠিকানা:</span> {order.address},{" "}
              {order.thana}, {order.district}
            </p>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="mb-2 font-semibold">বইসমূহ</p>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {typeof item.book === "object" ? item.book.title : "বই"} ×{" "}
                    {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right font-bold text-amber-600">
              মোট: {formatPrice(order.totalPrice)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
