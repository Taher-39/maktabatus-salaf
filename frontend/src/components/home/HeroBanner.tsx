"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center md:py-28 min-h-[60vh] md:min-h-[70vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold leading-tight md:text-5xl"
        >
          মাক্তাবাতুস সালাফ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 max-w-2xl text-base text-emerald-100 md:text-lg"
        >
          ইসলামিক বইয়ের বিশ্বস্ত অনলাইন দোকান — কুরআন, হাদিস, আকিদা, ফিকহ
          এবং আরও অনেক বিষয়ের বই এক জায়গায়
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/books"
            className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-emerald-900 transition hover:bg-amber-400"
          >
            বই দেখুন
          </Link>
          <Link
            href="/orders/track"
            className="rounded-lg border-2 border-amber-400 px-8 py-3 font-semibold text-amber-400 transition hover:bg-amber-400/10"
          >
            অর্ডার ট্র্যাক করুন
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
