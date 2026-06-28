import Image from "next/image";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-auto bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-3xl border border-amber-300 bg-white">
              <Image src="/Logo.jpg" alt="মাক্তাবাতুস সালাফ" fill className="object-cover" sizes=''/>
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
            <li>
              <Link href="/terms-and-conditions" className="hover:text-amber-400">
                শর্তাবলী (Terms &amp; Conditions)
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-amber-400">
                গোপনীয়তা নীতি (Privacy Policy)
              </Link>
            </li>
          </ul>
        </div>


        <div>
          <h4 className="mb-3 font-semibold text-white">যোগাযোগ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FiPhone className="text-amber-400" />
              <span>+8801407-021847</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-amber-400" />
              <span>maktabatussalaf47@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="text-amber-400" />
              <span>রাজশাহী, বাংলাদেশ</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">আমাদের অনুসরণ করুন</h4>
          <div className="flex flex-wrap gap-3">
             <a
              href="https://www.facebook.com/MaktabatusSalaf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900  transition hover:bg-red-600 hover:text-white"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://www.youtube.com/@MaktabatusSalaf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-amber-400 transition hover:bg-red-600 hover:text-white"
            >
              <FaYoutube size={20} />
            </a>
            <a
              href="https://x.com/maktabatussalaf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-amber-400 transition hover:bg-black hover:text-white"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/maktabatussalaf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="instagram-icon flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-amber-400 transition hover:text-white"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@maktabatussalaf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-amber-400 transition hover:bg-black hover:text-pink-500"
            >
              <FaTiktok size={18} />
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-emerald-300">
            সর্বশেষ ভিডিও, লেকচার ও ইসলামিক কন্টেন্ট পেতে আমাদের সোশ্যাল মিডিয়া চ্যানেলগুলোতে যুক্ত হোন।
          </p>
        </div>
      </div>

      <div className="border-t border-emerald-800 py-4 text-center text-xs text-emerald-400">
        © {new Date().getFullYear()} মাক্তাবাতুস সালাফ। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
