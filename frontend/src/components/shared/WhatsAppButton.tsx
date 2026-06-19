"use client";

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801712345678";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("আসসালামু আলাইকুম, আমি বই সম্পর্কে জানতে চাই।")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-110 hover:bg-green-600"
      aria-label="WhatsApp"
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}
