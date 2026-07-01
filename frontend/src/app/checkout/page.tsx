"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, createSslcommerzSession } from "@/lib/api";
import { useAuthStore, useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

const getShippingCharge = (weightGrams: number) => {
  const weightKg = weightGrams / 1000;
  if (weightKg <= 1) return 90;
  if (weightKg <= 2) return 110;
  if (weightKg <= 3) return 130;
  return 130 + Math.ceil(weightKg - 3) * 20;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SSLCOMMERZ">("COD");

  const totalWeightGrams = items.reduce((sum, item) => sum + item.book.weight * item.quantity, 0);
  const totalWeightKg = totalWeightGrams / 1000;
  const shippingCharge = getShippingCharge(totalWeightGrams);
  const orderTotal = totalPrice() + shippingCharge;

  const mongoOrderIdFromResponse = (res: any) => res?.data?._id;
  const publicOrderIdFromResponse = (res: any) => res?.data?.orderId || res?.data?._id;


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
      paymentMethod,
    };


    try {
      const res = await createOrder(payload);
      const mongoOrderId = mongoOrderIdFromResponse(res);
      const publicOrderId = publicOrderIdFromResponse(res);

      if (!mongoOrderId || !publicOrderId) throw new Error("Order id not found");

      if (paymentMethod === "SSLCOMMERZ") {
        const sessionRes = await createSslcommerzSession(mongoOrderId);
        const redirectUrl = sessionRes.data?.redirectGatewayURL;

        if (!redirectUrl) throw new Error("SSLCOMMERZ redirect URL not found");

        clearCart();
        window.location.href = redirectUrl;
        return;
      }


      // COD
      clearCart();
      router.push(`/orders/track?orderId=${publicOrderId}`);
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

          <fieldset className="space-y-3 rounded-lg border border-emerald-100 p-4">
            <legend className="px-1 text-sm font-semibold text-emerald-900">
              Payment method
            </legend>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-emerald-100 p-3 text-sm hover:border-emerald-300">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="h-4 w-4 accent-emerald-700"
              />
              <span>
                Cash on delivery
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-emerald-100 p-3 text-sm hover:border-emerald-300">
              <input
                type="radio"
                name="paymentMethod"
                value="SSLCOMMERZ"
                checked={paymentMethod === "SSLCOMMERZ"}
                onChange={() => setPaymentMethod("SSLCOMMERZ")}
                className="h-4 w-4 accent-emerald-700"
              />
              <span>
                Pay online with SSLCOMMERZ
              </span>
            </label>
          </fieldset>

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
          <div className="space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>ওজন</span>
              <span>{totalWeightKg.toFixed(2)} কেজি</span>
            </div>
            <div className="flex justify-between">
              <span>শিপিং চার্জ</span>
              <span>{formatPrice(shippingCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-amber-600">
              <span>মোট</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            অর্ডারের পর পেমেন্ট প্রুফ আপলোড করতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
