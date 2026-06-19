import Image from "next/image";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-auto bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-3xl border border-amber-300 bg-white">
              <Image src="/Logo.jpg" alt="মাক্তাবাতুস সালাফ" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-400">মাক্তাবাতুস সালাফ</h3>
              <p className="text-xs text-emerald-300">ইসলামিক বইয়ের অনলাইন ষ্টোর</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-emerald-200">
            ইসলামিক বইয়ের বিশ্বস্ত অনলাইন ষ্টোর। কুরআন, হাদিস, আকিদা, ফিকহ
            এবং আরও অনেক বিষয়ের বই পাবেন এখানে।
          </p>
        </div>
 
        <div>
          <h4 className="mb-3 font-semibold text-white">দ্রুত লিংক</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/books" className="hover:text-amber-400">
                সকল বই
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-amber-400">
                কার্ট
              </Link>
            </li>
            <li>
              <Link href="/orders/track" className="hover:text-amber-400">
                অর্ডার ট্র্যাক
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-amber-400">
                লগইন
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">যোগাযোগ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FiPhone className="text-amber-400" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-amber-400" />
              <span>info@maktabatussalaf.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-amber-400" />
              <span>ঢাকা, বাংলাদেশ</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-800 py-4 text-center text-xs text-emerald-400">
        © {new Date().getFullYear()} মাক্তাবাতুস সালাফ। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
