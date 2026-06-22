"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { getVideos } from "@/lib/api";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  videoId: string;
  publishedAt?: string;
}

// Fallback featured videos if API fails
const fallbackVideos: Video[] = [
  {
    id: "1",
    title: "সিলসিলা ছহীহ (Silsila Sahiha)",
    description: "আধুনিক যুগের শ্রেষ্ঠ মুহাদ্দিস শাইখ আল্লামা মুহাম্মাদ নাসিরুদ্দীন আলবানী (রহ.) কর্তৃক সংকলিত একটি বিশ্বস্ত ও প্রসিদ্ধ হাদিস গ্রন্থ",
    videoId: "ZYmNfJ_g2Bo",
    thumbnail: "https://i.ytimg.com/an/GIDiVMIjPEpW22rcCefrig/featured_channel.jpg?v=695b70b7",
  },
  {
    id: "2",
    title: "চিত্রসহ তাজবীদ শিক্ষা | ড. আয়মান রুশদী সুওয়াইদ",
    description: "বিশ্বব্যাপী বেস্ট সেলার তাজবীদ বইয়ের বাংলা সংস্করণ!লেখক: ড. আয়মান রুশদী সুওয়াইদ ",
    videoId: "yy8hh3LNda4",
    thumbnail: "https://i.ytimg.com/an/GIDiVMIjPEpW22rcCefrig/featured_channel.jpg?v=695b70b7",
  },
  {
    id: "3",
    title: "রাসূল ﷺ-এর সুন্নাতের সাথে প্রতিদিন",
    description: "এই মাসে আমরা নতুন ৫০টি বই যোগ করছি আমাদের স্টোরে।",
    videoId: "otqj9jzTAqE",
    thumbnail: "https://i.ytimg.com/vi/otqj9jzTAqE/hqdefault.jpg?sqp=-oaymwFECKgBEF5IWvKriqkDNwgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAHwAQH4Af4JgALQBYoCDAgAEAEYVSBlKF4wD7gC8xg=\u0026rs=AOn4CLBR93Q532vbqdVLNsk3sV5AXwwoag",
  },
];

export default function VideoReviews() {
  const [videos, setVideos] = useState<Video[]>(fallbackVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await getVideos(6);
        if (response.success && response.data && response.data.length > 0) {
          setVideos(response.data);
          setSelectedVideo(response.data[0]);
        } else {
          setSelectedVideo(fallbackVideos[0]);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setSelectedVideo(fallbackVideos[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (!selectedVideo && videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FaYoutube className="text-2xl text-red-600 sm:text-3xl" />
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 sm:text-3xl">
              বই পর্যালোচনা ও প্রচার
            </h2>
          </div>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 sm:text-base">
            আমাদের সর্বশেষ ভিডিও পর্যালোচনা এবং বই প্রচারণা দেখুন
          </p>
        </div>
        <a
          href="https://www.youtube.com/@MaktabatusSalaf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 sm:text-base"
        >
          <FaYoutube /> সাবস্ক্রাইব করুন
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Video Player */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
            {selectedVideo ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FaPlay className="mx-auto mb-4 text-5xl text-white opacity-50" />
                  <p className="text-white">ভিডিও লোড হচ্ছে...</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          {selectedVideo && (
            <div className="mt-4">
              <h3 className="mb-1 text-lg font-bold text-emerald-900 dark:text-emerald-100 sm:text-xl">
                {selectedVideo.title}
              </h3>
              <p className="line-clamp-2 text-sm text-emerald-600 dark:text-emerald-400 sm:text-base">
                {selectedVideo.description?.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <FaYoutube /> YouTube এ দেখুন
                </a>
                {selectedVideo.publishedAt && (
                  <span className="text-xs text-emerald-500 dark:text-emerald-400">
                    {new Date(selectedVideo.publishedAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video Playlist — compact cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
              আরও ভিডিও
            </h3>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
              {videos.length}টি
            </span>
          </div>

          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {videos.map((video) => {
              const isActive = selectedVideo?.id === video.id;
              return (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`group flex w-full items-center gap-3 overflow-hidden rounded-lg border p-2 text-left transition-all ${
                    isActive
                      ? "border-red-600 bg-red-50 shadow-md ring-1 ring-red-600 dark:bg-red-950/40"
                      : "border-gray-200 bg-white hover:border-emerald-400 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-600"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50">
                      <FaPlay className="text-xs text-white drop-shadow" />
                    </div>
                    {isActive && (
                      <div className="absolute left-1 top-1 rounded bg-red-600 px-1 text-[10px] font-bold text-white">
                        ▶ চলছে
                      </div>
                    )}
                  </div>

                  {/* Title + meta */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`line-clamp-2 text-xs font-semibold leading-snug ${
                        isActive
                          ? "text-red-700 dark:text-red-300"
                          : "text-emerald-900 dark:text-emerald-100"
                      }`}
                    >
                      {video.title}
                    </p>
                    {video.publishedAt && (
                      <p className="mt-1 text-[10px] text-emerald-500 dark:text-emerald-400">
                        {new Date(video.publishedAt).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
