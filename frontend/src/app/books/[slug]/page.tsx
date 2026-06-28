"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BookGallery from "@/components/product/BookGallery";
import ShareButtons from "@/components/product/ShareButtons";
import PreviewModal from "@/components/product/PreviewModal";
import FeaturedBooksCarousel from "@/components/shared/FeaturedBooksCarousel";
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
import { useToast } from "@/components/shared/ToastProvider";

const REVIEWS_PER_PAGE = 4;
const DESC_LINE_CLAMP = 10;

export default function BookDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedByCategory, setRelatedByCategory] = useState<Book[]>([]);
  const [relatedByAuthor, setRelatedByAuthor] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"book" | "author">("book");

  // ── Feature 3: বিবরণ see more/less ──────────────────────────────────────────
  const descRef = useRef<HTMLParagraphElement>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isDescOverflowing, setIsDescOverflowing] = useState(false);

  // ── Feature 4: PDF Preview Modal ─────────────────────────────────────────────
  const [showPreview, setShowPreview] = useState(false);

  // ── Reviews ──────────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewMeta, setReviewMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const addItem = useCartStore((s) => s.addItem);
  const { token } = useAuthStore();
  const isLoggedIn = !!token;

  // ── Book + related ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setShowFullDesc(false);

    getBookBySlug(slug)
      .then((res) => {
        const b = res.data;
        setBook(b);

        const categoryId =
          typeof b.category === "object" ? b.category._id : b.category;
        const authorId =
          typeof b.author === "object" ? b.author._id : b.author;

        // Feature 2: Same category + same author (parallel)
        Promise.all([
          getBooks({ category: categoryId, limit: 5 }),
          getBooks({ author: authorId, limit: 5 }),
        ]).then(([catRes, authRes]) => {
          setRelatedByCategory(
            catRes.data.filter((x: Book) => x._id !== b._id).slice(0, 4)
          );
          setRelatedByAuthor(
            authRes.data.filter((x: Book) => x._id !== b._id).slice(0, 4)
          );
        });
      })
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Feature 3: overflow detect ────────────────────────────────────────────────
  useEffect(() => {
    if (!showFullDesc && descRef.current) {
      setIsDescOverflowing(
        descRef.current.scrollHeight > descRef.current.clientHeight + 2
      );
    }
  }, [book?.description, showFullDesc]);

  // ── Reviews ──────────────────────────────────────────────────────────────────
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
    book.author && typeof book.author === "object"
      ? (book.author as any)
      : null;
  const authorId =
    typeof book.author === "object" ? book.author._id : book.author;
  const categoryId =
    typeof book.category === "object" ? book.category._id : book.category;

  // preview পাওয়া যাবে কিনা
  const hasPreview =
    (book.previewPdf && book.previewPdf.length > 0) ||
    !!(book as any).previewPdf;

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addItem(book);
    router.push("/checkout");
  };

  const { showToast } = useToast();

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setReviewError("");
    try {
      await createReview({ book: book._id, rating, comment: comment.trim() });
      setComment("");
      setRating(5);
      await fetchReviews(1);
      showToast("রিভিউ সফলভাবে জমা দেওয়া হয়েছে", "success");
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

      {/* ════════════════════════════════════════════════════════
          বইয়ের মূল সেকশন — ৩ কলাম লেআউট
          col-1: image | col-2-3: top=carousel, bottom=info
          ════════════════════════════════════════════════════ */}
      <div className="grid gap-8 md:grid-cols-3">

        {/* ── বাম: Cover Image + Preview Button ── */}
        <div className="relative">
          {/* Feature 4: Cover image click → PDF modal */}
          <div
            className={hasPreview ? "cursor-pointer" : ""}
            onClick={() => hasPreview && setShowPreview(true)}
            title={hasPreview ? "ক্লিক করে বইয়ের ভেতরে দেখুন" : undefined}
          >
            {/* হলুদ badge যদি preview থাকে */}
            {hasPreview && (
              <div className="absolute left-2 top-2 z-10 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-emerald-900 shadow">
                👁 পূর্বরূপ
              </div>
            )}
            <BookGallery
              coverImage={book.coverImage}
              title={book.title}
              // previewPdf={book.previewPdf}
            />
          </div>

          {/* Feature 4: "একটু পড়ে দেখুন" Button */}
          {hasPreview && (
            <button
              onClick={() => setShowPreview(true)}
              className="mt-3 w-full rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              📖 একটু পড়ে দেখুন
            </button>
          )}
        </div>

        {/* ── ডান: Carousel (top) + Book Info (bottom) ── */}
        <div className="md:col-span-2">

          {/* Feature 1: Compact Featured Carousel — top right */}
          <FeaturedBooksCarousel variant="compact" excludeId={book._id} />

          {/* Book Info */}
          <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">
            {book.title}
          </h1>

          {/* Feature 2: Author → clickable */}
          {authorDetails && (
            <Link
              href={`/authors/${authorDetails.slug}`}
              className="mt-2 inline-block text-gray-600 transition hover:text-emerald-700 hover:underline"
            >
              লেখক: {authorName}
            </Link>
          )}

          {/* Feature 2: Category → clickable */}
          {categoryId && (
            <Link
              href={`/categories/${categoryId}`}
              className="block text-sm text-gray-500 transition hover:text-emerald-700 hover:underline"
            >
              ক্যাটাগরি: {typeof book.category === "object" ? book.category.name : "ক্যাটাগরি"}
            </Link>
          )}

          <p className="mt-4 text-3xl font-bold text-amber-600">
            {formatPrice(book.price)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {inStock ? `${book.stock} টি স্টকে আছে` : "স্টক শেষ"}
          </p>

          {/* বইয়ের তথ্য — পৃষ্ঠা, সংস্করণ, ওজন */}
          <div className="mt-4 flex flex-wrap gap-3">
            {book.bookPage > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
                <span>📄</span> {book.bookPage} পৃষ্ঠা
              </span>
            )}
            {book.edition > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 border border-amber-100">
                <span>📖</span> {book.edition}ম সংস্করণ
              </span>
            )}
            {book.weight > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200">
                <span>⚖️</span> {book.weight} গ্রাম
              </span>
            )}
          </div>

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

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="mt-6 min-h-[150px]">
            {activeTab === "book" && (
              <div>
                {book.description ? (
                  <>
                    {/* Feature 3: ১০ লাইন clamp */}
                    <div
                      ref={descRef}
                      className="leading-relaxed text-gray-700 whitespace-pre-line"
                      style={
                        showFullDesc
                          ? undefined
                          : {
                              display: "-webkit-box",
                              WebkitLineClamp: DESC_LINE_CLAMP,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }
                      }
                    >
                      <div
                      className="mt-3 text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: book.description,
                      }}
                    />
                    </div>

                    {/* Feature 3: See More / See Less Button */}
                    {(isDescOverflowing || showFullDesc) && (
                      <button
                        onClick={() => setShowFullDesc((v) => !v)}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
                      >
                        {showFullDesc ? (
                          <>কম দেখুন <span className="text-xs">▲</span></>
                        ) : (
                          <>আরো দেখুন <span className="text-xs">▼</span></>
                        )}
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
                  <h3 className="text-lg font-bold text-gray-900">
                    {authorName}
                  </h3>
                  {authorDetails.description ? (
                    <div
                      className="mt-3 text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: authorDetails.description,
                      }}
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

      {/* ════════════════════════════════════════════════════════
          Feature 2: একই ক্যাটাগরির বই
          ════════════════════════════════════════════════════ */}
      {relatedByCategory.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="border-b-2 border-emerald-100 pb-1 text-xl font-bold text-emerald-900">
              একই ক্যাটাগরির আরও বই
            </h2>
            {categoryId && (
              <Link
                href={`/books?category=${categoryId}`}
                className="text-sm text-emerald-600 hover:underline"
              >
                সব দেখুন →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedByCategory.map((item) => (
              <RelatedBookCard key={item._id} book={item} />
            ))}
          </div>
        </div>
      )}

      {/* Feature 2: একই লেখকের বই */}
      {relatedByAuthor.length > 0 && (
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="border-b-2 border-amber-200 pb-1 text-xl font-bold text-emerald-900">
              {authorName}-এর আরও বই
            </h2>
            {authorId && (
              <Link
                href={`/books?author=${authorId}`}
                className="text-sm text-emerald-600 hover:underline"
              >
                সব দেখুন →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedByAuthor.map((item) => (
              <RelatedBookCard key={item._id} book={item} />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          Review Section
          ════════════════════════════════════════════════════ */}
      <div className="grid gap-8 md:grid-cols-3 rounded-2xl bg-gray-50 p-6 md:p-8">
        {/* রিভিউ ফর্ম */}
        <div className="md:col-span-1">
          <h3 className="mb-4 text-lg font-bold text-emerald-900">
            একটি রিভিউ লিখুন
          </h3>
          {isLoggedIn ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  আপনার রেটিং:
                </label>
                <div className="flex gap-1 text-2xl text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition hover:scale-110 focus:outline-none"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  মন্তব্য:
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="বইটি সম্পর্কে আপনার মতামত লিখুন..."
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              {reviewError && (
                <p className="text-sm text-red-600">{reviewError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
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

        {/* রিভিউ লিস্ট + পেজিনেশন */}
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-emerald-900">
            গ্রাহকদের রিভিউ ({reviewMeta.total})
          </h3>

          <div className="min-h-[400px] space-y-4">
            {reviewsLoading ? (
              <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
            ) : reviews.length === 0 ? (
              <p className="italic text-sm text-gray-400">
                এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনার হোক!
              </p>
            ) : (
              reviews.map((rev) => {
                const reviewerName =
                  typeof rev.user === "object" ? rev.user.name : "ব্যবহারকারী";
                return (
                  <div
                    key={rev._id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {reviewerName}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString("bn-BD")}
                      </span>
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

          {/* Pagination */}
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

      {/* ════════════════════════════════════════════════════════
          Feature 4: PDF / Preview Modal
          ════════════════════════════════════════════════════ */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        previewPdf={book.previewPdf}
        bookTitle={book.title}
      />
    </div>
  );
}

// ── Small reusable related book card ────────────────────────────────────────────
function RelatedBookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full object-cover transition group-hover:scale-105"
        />
      </div>
      <h3 className="line-clamp-1 text-sm font-semibold text-gray-800 group-hover:text-emerald-700">
        {book.title}
      </h3>
      <p className="mt-1 text-sm font-bold text-amber-600">
        {formatPrice(book.price)}
      </p>
    </Link>
  );
}


