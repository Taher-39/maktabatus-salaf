"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { getActiveBanners, Banner } from "@/lib/api";

export default function PromoBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveBanners("promotion")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBanner(res.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Static fallback
  const fallbackImage = "/Banner.jpg";
  const fallbackTitle = "বিশ্বস্ত ইসলামিক বইয়ের গন্তব্য";
  const fallbackDesc = "তাজা প্রকাশনা, বিশেষ অ্যালার্ট, এবং বাংলা ভাষায় বইয়ের পরামর্শ সহ আপনার পড়ার জীবনকে সহজ করুন।";

  const image = banner?.image || fallbackImage;
  const title = banner?.title || fallbackTitle;
  const description = banner?.description || fallbackDesc;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl">
        {banner?.image || loading ? (
          <img
            src={image}
            alt={title}
            className="h-auto w-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt={title}
            width={1600}
            height={700}
            className="h-auto w-full object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-emerald-900/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-y-0 left-0 flex w-full max-w-2xl items-center px-6 py-8"
        >
          <div className="rounded-3xl border border-emerald-200 bg-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
            <p className="mt-3 max-w-xl text-sm text-emerald-100 md:text-base">
              {description}
            </p>
            {banner?.link && (
              <Link
                href={banner.link}
                className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-2 font-semibold text-emerald-900 transition hover:bg-amber-400"
              >
                আরও জানুন
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}