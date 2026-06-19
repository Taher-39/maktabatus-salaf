"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold text-emerald-900">
          আপনার কার্ট খালি
        </h1>
        <p className="mt-2 text-gray-500">কিছু বই যোগ করে শুরু করুন</p>
        <Link
          href="/books"
          className="mt-6 inline-block rounded-lg bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800"
        >
          বই দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-900">কার্ট</h1>

      <div className="space-y-4">
        {items.map(({ book, quantity }) => (
          <div
            key={book._id}
            className="flex gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
          >
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded bg-emerald-50">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">📚</div>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <Link
                href={`/books/${book.slug}`}
                className="font-semibold text-emerald-900 hover:underline"
              >
                {book.title}
              </Link>
              <p className="text-sm text-amber-600">{formatPrice(book.price)}</p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(book._id, quantity - 1)}
                    className="rounded border p-1 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(book._id, quantity + 1)}
                    className="rounded border p-1 hover:bg-gray-100"
                    disabled={quantity >= book.stock}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {formatPrice(book.price * quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(book._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>মোট</span>
          <span className="text-amber-600">{formatPrice(totalPrice())}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block w-full rounded-lg bg-emerald-700 py-3 text-center font-semibold text-white hover:bg-emerald-800"
        >
          চেকআউট করুন
        </Link>
      </div>
    </div>
  );
}
