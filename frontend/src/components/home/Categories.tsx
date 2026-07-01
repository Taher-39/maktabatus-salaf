"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data || []));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-emerald-900">ক্যাটাগরি</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {categories.map((c, index) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-sm"
          >
            <Link href={`/categories/${c._id}`} className="flex h-full flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                {c.image ? <img src={c.image} alt={c.name} className="h-10 w-10 object-contain"/> : "📚"}
              </div>
              <div className="text-base font-semibold text-emerald-900">{c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
