"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">কার্ট খালি — প্রথমে বই যোগ করুন</p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      email: (form.get("email") as string) || undefined,
      address: form.get("address") as string,
      thana: form.get("thana") as string,
      district: form.get("district") as string,
      items: items.map((i) => ({
        book: i.book._id,
        quantity: i.quantity,
        price: i.book.price,
      })),
    };

    try {
      const res = await createOrder(payload);
      clearCart();
      router.push(
        `/orders/track?orderId=${res.data?.orderId || res.data?._id}`
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "অর্ডার ব্যর্থ হয়েছে";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-900">চেকআউট</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">নাম *</label>
            <input
              name="name"
              required
              defaultValue={user?.name || ""}
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              ফোন নম্বর *
            </label>
            <input
              name="phone"
              required
              defaultValue={user?.phone || ""}
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ইমেইল</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ঠিকানা *</label>
            <textarea
              name="address"
              required
              rows={2}
              defaultValue={user?.address?.village || ""}
              className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">থানা *</label>
              <input
                name="thana"
                required
                defaultValue={user?.address?.thana || ""}
                className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">জেলা *</label>
              <input
                name="district"
                required
                defaultValue={user?.address?.district || ""}
                className="w-full rounded-lg border border-emerald-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "অর্ডার হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </button>
        </form>

        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-emerald-900">অর্ডার সারাংশ</h2>
          <ul className="space-y-3">
            {items.map(({ book, quantity }) => (
              <li key={book._id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 pr-2">
                  {book.title} × {quantity}
                </span>
                <span>{formatPrice(book.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 font-bold">
            <span>মোট</span>
            <span className="text-amber-600">{formatPrice(totalPrice())}</span>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            অর্ডারের পর পেমেন্ট প্রুফ আপলোড করতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
