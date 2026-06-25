"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAuthorBySlug, getAuthorBooksById } from "@/lib/api"; 
import { Author, Book } from "@/lib/types";
import BookCard from "@/components/shared/BookCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function AuthorDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false); 

  // useEffect(() => {
  //   if (!slug) return;
  //   setLoading(true);
    
  //   getAuthorBySlug(slug)
  //     .then((res) => {
  //       setAuthor(res.data);
  //       if (res.data && res.data._id) {
  //         const id = res.data._id; 
  //         console.log("Author ID from Response:", id);
  //         getAuthorBooksById(id)
  //           .then((bookRes) => {
  //             setBooks(bookRes.data || []);
  //           })
  //           .catch(console.error);
  //       }
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }, [slug]);

useEffect(() => {
  if (!slug) return;
  setLoading(true);
  
  getAuthorBySlug(slug)
    .then((res) => {
      setAuthor(res.data);
      if (res.data && res.data._id) {
        const id = res.data._id; 
        getAuthorBooksById(id)
          .then((bookRes) => {
            setBooks(bookRes.data || []);
            console.log("Books fetched for author ID:", id, bookRes.data);
          })
          .catch(console.error);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, [slug]);

  if (loading) return <LoadingSpinner />;
  
  if (!author) {
    return (
      <div className="text-center text-gray-500 my-16 px-4">
        <p className="text-lg font-medium">লেখক পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:py-12">
      <section className="w-full rounded-2xl bg-gray-50/70 border border-gray-100 p-5 md:p-8 mb-10 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-6 md:gap-8">
        <div className="shrink-0">
          {author.image ? (
            <img
              src={author.image}
              alt={author.name}
              className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full bg-emerald-100 text-3xl md:text-4xl font-bold text-emerald-800 shadow-sm border-4 border-white">
              {author.name ? author.name[0] : "A"}
            </div>
          )}
        </div>

        {/* লেখক ডিটেইলস */}
        <div className="flex-1 w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-950">
            {author.name}
          </h1>
          
          {author.description ? (
            <div className="mt-4">
              <div
                /* line-clamp-5 দিয়ে টেক্সট ৫ লাইনে লক করা হয়েছে */
                className={`text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line overflow-hidden break-words transition-all duration-300 ${
                  !isExpanded ? "line-clamp-5" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: author.description,
                }}
              />
              {/* See More / See Less বাটন */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 focus:outline-none transition"
              >
                {isExpanded ? "কম দেখুন ▲" : "আরও দেখুন ▼"}
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm italic text-gray-400">
              লেখকের কোনো বিবরণ পাওয়া যায়নি।
            </p>
          )}

          <div className="mt-4">
            <span className="inline-block bg-emerald-50 text-emerald-800 text-xs md:text-sm font-semibold px-3 py-1 rounded-full">
              মোট বই: {books.length} টি
            </span>
          </div>
        </div>
      </section>

      {/* ─── লেখকের বইসমূহ সেকশন ─── */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900 mb-6 relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-emerald-600">
          লেখকের বইসমূহ
        </h2>
        
        {books.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-white">
            <p className="text-gray-500 text-sm md:text-base">এই লেখকের কোনো বই পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}