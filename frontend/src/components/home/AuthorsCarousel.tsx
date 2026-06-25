"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAuthors } from "@/lib/api";
import { Author } from "@/lib/types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // আইকন ইমপোর্ট

export default function AuthorsCarousel() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); // স্ক্রল হ্যান্ডেল করার জন্য রেফ

  useEffect(() => {
    getAuthors({ limit: 10 }).then((res) => setAuthors(res.data || []));
  }, []);

  // ডানে বা বামে স্ক্রল করার ফাংশন
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // এক ক্লিকে কতটুকু স্ক্রল হবে (এখানে কন্টেইনারের অর্ধেক সাইজ স্ক্রল হবে)
      const scrollAmount = clientWidth / 2; 
      
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 relative group">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6">জনপ্রিয় লেখক</h2>
      
      {/* মেইন কন্টেইনার wrapper */}
      <div className="relative flex items-center">
        
        {/* বাম দিকের অ্যারো বাটন */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 md:group-hover:opacity-100 transition duration-300 focus:outline-none"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        {/* ক্যারাউজেল আইটেমস (স্ক্রলবার হাইড করা) */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-2 w-full scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {authors.map((author) => (
            <Link 
              key={author._id} 
              href={`/authors/${author.slug}`} 
              className="flex-shrink-0 w-32 text-center group/item block"
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover/item:border-emerald-600 transition duration-300">
               { author.image && <img 
                  src={author.image} 
                  alt={author.name} 
                  sizes="128px"
                  className="object-cover" 
                />}
              </div>
              <p className="font-semibold text-sm text-gray-800 group-hover/item:text-emerald-700 transition">
                {author.name}
              </p>
            </Link>
          ))}
        </div>

        {/* ডান দিকের অ্যারো বাটন */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 md:group-hover:opacity-100 transition duration-300 focus:outline-none"
          aria-label="Scroll right"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}