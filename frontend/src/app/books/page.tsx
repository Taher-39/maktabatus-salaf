"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookGallery from "@/components/product/BookGallery";
import ShareButtons from "@/components/product/ShareButtons";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  getBookBySlug,
  getBooks,
  getBookReviews,
  createReview,
} from "@/lib/api";
import { useCartStore, useAuthStore } from "@/lib/store";
import type { Book, Review } from "@/lib/types";
import { formatPrice, getAuthorName, getCategoryName } from "@/lib/utils";

const REVIEWS_PER_PAGE = 4;

export default function BookDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"book" | "author">("book");

  // বিবরণ "আরো দেখুন" এর জন্য
  const descRef = useRef<HTMLParagraphElement>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isDescOverflowing, setIsDescOverflowing] = useState(false);

  // রিভিউ লিস্ট + পেজিনেশন
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewMeta, setReviewMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // রিভিউ ফর্ম
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const { token } = useAuthStore();
  const isLoggedIn = !!token;

  // ── বইয়ের ডাটা + related books ───────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    getBookBySlug(slug)
      .then((res) => {
        const currentBook = res.data;
        setBook(currentBook);

        const categoryId =
          typeof currentBook.category === "object"
            ? currentBook.category._id
            : currentBook.category;

        getBooks({ category: categoryId, limit: 4 })
          .then((relatedRes) => {
            const filtered = relatedRes.data.filter(
              (b: Book) => b._id !== currentBook._id
            );
            setRelatedBooks(filtered);
          })
          .catch((err) => console.error("Error fetching related books", err));
      })
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── বিবরণ overflow হচ্ছে কিনা মাপা (১০ লাইনের বেশি কিনা) ───────────────────
  useEffect(() => {
    if (!showFullDesc && descRef.current) {
      setIsDescOverflowing(
        descRef.current.scrollHeight > descRef.current.clientHeight + 2
      );
    }
  }, [book?.description, showFullDesc]);

  // ── রিভিউ ফেচ করা ───────────────────────────────────────────────────────────
  const fetchReviews = async (page: number) => {
    if (!book) return;
    setReviewsLoading(true);
    try {
      const res = await getBookReviews(book._id, {
        page,
        limit: REVIEWS_PER_PAGE,
        sortBy: "newest",
      });
      setReviews(res.data || []);
      setReviewMeta({
        page: res.meta?.page || 1,
        totalPages: res.meta?.totalPages || 1,
        total: res.meta?.total || 0,
      });
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (book?._id) fetchReviews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?._id]);

  if (loading) return <LoadingSpinner />;
  if (!book)
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">বই পাওয়া যায়নি</p>
      </div>
    );

  const authorName = getAuthorName(book.author);
  const categoryName = getCategoryName(book.category);
  const inStock = book.stock > 0;
  const authorDetails =
    book.author && typeof book.author === "object" ? (book.author as any) : null;

  // ✅ author/category এর আইডি বের করা — Link বানানোর জন্য
  const authorId =
    typeof book.author === "object" ? book.author._id : book.author;
  const categoryId =
    typeof book.category === "object" ? book.category._id : book.category;

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(book);
    router.push("/checkout");
  };

  // ✅ Real backend এর সাথে কানেক্টেড রিভিউ সাবমিট
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !book) return;

    setSubmitting(true);
    setReviewError("");

    try {
      await createReview({ book: book._id, rating, comment: comment.trim() });
      setComment("");
      setRating(5);
      await fetchReviews(1); // নতুন রিভিউ সহ প্রথম পেজ আবার লোড করো
    } catch (err: any) {
      setReviewError(
        err?.response?.data?.message || "রিভিউ জমা দিতে সমস্যা হয়েছে"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* বইয়ের মূল সেকশন */}
      <div className="grid gap-8 md:grid-cols-3">
        <BookGallery
          coverImage={book.coverImage}
          title={book.title}
          previewPages={book.previewPages}
        />

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">
            {book.title}
          </h1>

          {/* ✅ লেখক — clickable link */}
          {authorName && authorId && (
            <Link
              href={`/books?author=${authorId}`}
              className="mt-2 inline-block text-gray-600 transition hover:text-emerald-700 hover:underline"
            >
              লেখক: {authorName}
            </Link>
          )}

          {/* ✅ ক্যাটাগরি — clickable link */}
          {categoryName && categoryId && (
            <Link
              href={`/books?category=${categoryId}`}
              className="block text-sm text-gray-500 transition hover:text-emerald-700 hover:underline"
            >
              ক্যাটাগরি: {categoryName}
            </Link>
          )}

          <p className="mt-4 text-3xl font-bold text-amber-600">
            {formatPrice(book.price)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {inStock ? `${book.stock} টি স্টকে আছে` : "স্টক শেষ"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-emerald-900 transition hover:bg-amber-400 disabled:opacity-50 sm:flex-none"
            >
              এখনই কিনুন
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 rounded-lg border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 sm:flex-none"
            >
              {added ? "✓ কার্টে যোগ হয়েছে" : "কার্টে যোগ করুন"}
            </button>
          </div>

          <div className="mt-6">
            <ShareButtons url={`/books/${book.slug}`} title={book.title} />
          </div>

          {/* ট্যাব বাটন */}
          <div className="mt-10 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("book")}
              className={`pb-3 pr-6 text-lg font-bold transition-all ${
                activeTab === "book"
                  ? "border-b-2 border-emerald-700 text-emerald-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              বইয়ের বিবরণ
            </button>
            {authorDetails && (
              <button
                onClick={() => setActiveTab("author")}
                className={`pb-3 px-6 text-lg font-bold transition-all ${
                  activeTab === "author"
                    ? "border-b-2 border-emerald-700 text-emerald-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                লেখক পরিচিতি
              </button>
            )}
          </div>

          {/* ট্যাব কনটেন্ট */}
          <div className="mt-6 min-h-[150px]">
            {activeTab === "book" && (
              <div>
                {book.description ? (
                  <>
                    {/* ✅ ১০ লাইন পর্যন্ত দেখাবে, তারপর ক্লিপ */}
                    <p
                      ref={descRef}
                      className="leading-relaxed text-gray-700 whitespace-pre-line"
                      style={
                        showFullDesc
                          ? undefined
                          : {
                              display: "-webkit-box",
                              WebkitLineClamp: 10,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }
                      }
                    >
                      {book.description}
                    </p>

                    {/* ✅ শুধু overflow হলে বাটন দেখাবে */}
                    {(isDescOverflowing || showFullDesc) && (
                      <button
                        onClick={() => setShowFullDesc((prev) => !prev)}
                        className="mt-2 text-sm font-semibold text-emerald-700 hover:underline"
                      >
                        {showFullDesc ? "সংক্ষেপে দেখুন" : "আরো দেখুন"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="italic text-gray-400">
                    এই বইটির কোনো বিবরণ পাওয়া যায়নি।
                  </p>
                )}
              </div>
            )}

            {activeTab === "author" && authorDetails && (
              <div className="flex flex-col gap-5 rounded-xl bg-gray-50 p-5 sm:flex-row sm:items-start">
                {authorDetails.image ? (
                  <img
                    src={authorDetails.image}
                    alt={authorName}
                    className="h-24 w-24 shrink-0 rounded-full border border-emerald-100 object-cover shadow-sm mx-auto sm:mx-0"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-800 mx-auto sm:mx-0">
                    {authorName ? authorName[0] : "A"}
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">{authorName}</h3>
                  {authorDetails.description ? (
                    <div
                      className="author-html-content mt-3 text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: authorDetails.description }}
                    />
                  ) : (
                    <p className="mt-2 text-sm italic text-gray-400">
                      লেখকের কোনো বিবরণ পাওয়া যায়নি।
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-12 border-gray-200" />

      {/* --- একই ক্যাটাগরির অন্যান্য বই --- */}
      {relatedBooks.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-emerald-900 border-b-2 border-emerald-100 pb-2 inline-block">
            এই ক্যাটাগরির আরও বই
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedBooks.map((item) => (
              <Link
                href={`/books/${item.slug}`}
                key={item._id}
                className="group rounded-xl border border-gray-100 p-3 shadow-sm transition hover:shadow-md bg-white"
              >
                <div className="overflow-hidden rounded-lg bg-gray-50 aspect-[3/4] flex items-center justify-center mb-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="h-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <h3 className="line-clamp-1 text-sm font-semibold text-gray-800 group-hover:text-emerald-700">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-bold text-amber-600">
                  {formatPrice(item.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* --- রিভিউ এবং রেটিং সেকশন --- */}
      <div className="grid gap-8 md:grid-cols-3 bg-gray-50 rounded-2xl p-6 md:p-8">
        {/* রিভিউ ফর্ম */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">একটি রিভিউ লিখুন</h3>

          {isLoggedIn ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  আপনার রেটিং:
                </label>
                <div className="flex gap-1 text-2xl text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition hover:scale-110"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  মন্তব্য:
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="বইটি সম্পর্কে আপনার মতামত লিখুন..."
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none bg-white shadow-sm"
                  required
                />
              </div>

              {reviewError && (
                <p className="text-sm text-red-600">{reviewError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800 text-sm disabled:opacity-60"
              >
                {submitting ? "জমা হচ্ছে..." : "রিভিউ জমা দিন"}
              </button>
            </form>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
              রিভিউ দিতে হলে আগে{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 hover:underline"
              >
                লগইন করুন
              </Link>
            </div>
          )}
        </div>

        {/* গ্রাহকদের রিভিউ লিস্ট + পেজিনেশন */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">
            গ্রাহকদের রিভিউ ({reviewMeta.total})
          </h3>

          {/* ✅ fixed min-height — আগে যতটুকু জায়গা নিতো ততটুকুই থাকবে */}
          <div className="min-h-[400px] space-y-4">
            {reviewsLoading ? (
              <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
            ) : reviews.length === 0 ? (
              <p className="italic text-gray-400 text-sm">
                এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনার হোক!
              </p>
            ) : (
              reviews.map((rev) => {
                const reviewerName =
                  typeof rev.user === "object" ? rev.user.name : "ব্যবহারকারী";
                const reviewDate = new Date(rev.createdAt).toLocaleDateString(
                  "bn-BD"
                );

                return (
                  <div
                    key={rev._id}
                    className="rounded-xl bg-white p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {reviewerName}
                      </h4>
                      <span className="text-xs text-gray-400">{reviewDate}</span>
                    </div>
                    <div className="mt-1 text-sm text-amber-400">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{rev.comment}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* ✅ পেজিনেশন */}
          {reviewMeta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                disabled={reviewMeta.page <= 1}
                onClick={() => fetchReviews(reviewMeta.page - 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                আগে
              </button>

              {Array.from({ length: reviewMeta.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => fetchReviews(p)}
                    className={`h-8 w-8 rounded-lg text-sm transition ${
                      p === reviewMeta.page
                        ? "bg-emerald-700 text-white"
                        : "border text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                disabled={reviewMeta.page >= reviewMeta.totalPages}
                onClick={() => fetchReviews(reviewMeta.page + 1)}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                পরে
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
