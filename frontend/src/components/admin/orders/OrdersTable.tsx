"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import axios from "axios";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
};

const statusLabels: Record<string, string> = {
  pending: "অপেক্ষমান",
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল করা হয়েছে",
};

const paymentLabels: Record<string, string> = {
  pending: "পেমেন্ট অপেক্ষমান",
  approved: "পেমেন্ট অনুমোদিত",
};

async function fetchOrdersAdmin() {
  const token = localStorage.getItem("token");

  const res = await axios.get<ApiResponse<any[]>>(`${API_URL}/orders`, {
    params: { limit: 200 },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError("");
        setLoading(true);

        const res = await fetchOrdersAdmin();
        if (!mounted) return;
        setOrders((res.data || []) as Order[]);
      } catch {
        if (!mounted) return;
        setError("অর্ডার লোড করা যায়নি");
        setOrders([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => orders, [orders]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-emerald-50 text-emerald-900">
            <th className="px-4 py-3 text-left font-semibold">Order</th>
            <th className="px-4 py-3 text-left font-semibold">Customer</th>
            <th className="px-4 py-3 text-left font-semibold">Total</th>
            <th className="px-4 py-3 text-left font-semibold">Order Status</th>
            <th className="px-4 py-3 text-left font-semibold">Payment</th>
            <th className="px-4 py-3 text-left font-semibold">tran_id</th>
            <th className="px-4 py-3 text-left font-semibold">Proof</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                কোনো অর্ডার নেই
              </td>
            </tr>
          ) : (
            rows.map((order: any) => (
              <tr key={order._id} className="border-t border-emerald-100">
                <td className="px-4 py-3">
                  <div className="font-semibold text-emerald-900">{order.orderId}</div>
                  <div className="text-xs text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("bn-BD")
                      : "—"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium">{order.name || "—"}</div>
                  <div className="text-xs text-gray-500">{order.phone || "—"}</div>
                </td>

                <td className="px-4 py-3 font-semibold text-amber-600">
                  {formatPrice(order.grandTotal ?? order.totalPrice ?? 0)}
                </td>

                <td className="px-4 py-3">
                  {statusLabels[order.orderStatus] || order.orderStatus || "—"}
                </td>

                <td className="px-4 py-3">
                  {paymentLabels[order.paymentStatus] || order.paymentStatus || "—"}
                </td>

                <td className="px-4 py-3">{order.tran_id || "—"}</td>

                <td className="px-4 py-3">
                  {order.paymentProof ? (
                    <a
                      href={order.paymentProof}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

