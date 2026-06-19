"use client";

import Image from "next/image";
import { useState } from "react";

interface BookGalleryProps {
  coverImage: string;
  title: string;
  previewPages?: string[];
}

export default function BookGallery({
  coverImage,
  title,
  previewPages = [],
}: BookGalleryProps) {
  const [activeImage, setActiveImage] = useState(coverImage);
  const images = [coverImage, ...previewPages].filter(Boolean);

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-emerald-50">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            📚
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative h-16 w-12 shrink-0 overflow-hidden rounded border-2 ${
                activeImage === img
                  ? "border-amber-500"
                  : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
