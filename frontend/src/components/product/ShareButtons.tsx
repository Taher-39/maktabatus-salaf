"use client";

import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${url}`
      : url;

  const shareLinks = [
    {
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
      label: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: FaFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      label: "Facebook",
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    alert("লিংক কপি হয়েছে!");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">শেয়ার:</span>
      {shareLinks.map(({ icon: Icon, href, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${color}`}
          aria-label={label}
        >
          <Icon />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        aria-label="Copy link"
      >
        <FiLink />
      </button>
    </div>
  );
}
