"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useAuthStore, useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/books", label: "সকল বই" },
  { href: "/orders/track", label: "অর্ডার ট্র্যাক" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItems());
  const links = user?.role === "admin"
    ? [...navLinks, { href: "/admin", label: "ড্যাশবোর্ড" }]
    : navLinks;

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-emerald-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-amber-300 bg-white">
            <Image src="/Logo.jpg" alt="মাক্তাবাতুস সালাফ" fill className="object-cover" />
          </div>
          <span className="text-lg font-bold tracking-wide">
            মাক্তাবাতুস সালাফ
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition hover:text-amber-300",
                pathname === link.href && "text-amber-400 font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/books"
            className="hidden rounded-full p-2 hover:bg-emerald-800 sm:block"
            aria-label="Search books"
          >
            <FiSearch className="text-xl" />
          </Link>

          <button
            type="button"
            className="rounded-full border border-emerald-700 bg-emerald-900/70 p-2 text-emerald-100 transition hover:bg-emerald-800"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <FiSun className="text-xl" />
            ) : (
              <FiMoon className="text-xl" />
            )}
          </button>

          <Link
            href="/cart"
            className="relative rounded-full p-2 hover:bg-emerald-800"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-xl" />
            {mounted && cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-emerald-900"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          <Link
            href={user ? "/profile" : "/auth/login"}
            className="hidden rounded-full p-2 hover:bg-emerald-800 md:block"
            aria-label="Profile"
          >
            <FiUser className="text-xl" />
          </Link>

          <button
            className="rounded p-2 hover:bg-emerald-800 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-emerald-700 bg-emerald-900 px-4 py-3 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm hover:text-amber-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={user ? "/profile" : "/auth/login"}
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm hover:text-amber-300"
          >
            {user ? "প্রোফাইল" : "লগইন"}
          </Link>
        </motion.nav>
      )}
    </header>
  );
}
