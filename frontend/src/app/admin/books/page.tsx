"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useToast } from "@/components/shared/ToastProvider";
import { Book, Category, Author, Publisher } from "@/lib/types";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import RichTextEditor from "@/components/shared/RichTextEditor";

const initialFormState = {
  title: "",
  slug: "",
  description: "",
  author: "",
  category: "",
  publisher: "",
  price: "",
  stock: "",
  bookPage: "",
  weight: "",
  edition: "",
  coverImage: "",
  previewPdf: "",
};

export default function AdminBooksPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewPdf, setPreviewPdf] = useState<File | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string>("");
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  const uploadPreviewPdf = async (file: File) => {
    setIsUploadingPdf(true);
    try {
      if (file.type !== "application/pdf") {
        showToast("শুধুমাত্র PDF ফাইল গ্রহণযোগ্য", "error");
        return;
      }

      // This endpoint is implemented at: /api/uploadthing (UploadThing).
      // It returns a URL which we will pass to backend as `previewPdfUrl`.
      const form = new FormData();
      form.append("pdf", file);

      const res = await fetch("/api/uploadthing", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Upload failed: ${res.status}`);
      }

      const data = await res.json();

      // UploadThing response shape can vary; handle common ones.
      const url =
        data?.fileUrl ||
        data?.url ||
        data?.data?.url ||
        data?.data?.fileUrl ||
        data?.[0]?.url ||
        data?.[0]?.fileUrl;

      if (!url) {
        throw new Error("Upload succeeded but URL missing in response");
      }

      setPreviewPdfUrl(url);
    } catch (e: any) {
      console.error(e);
      setPreviewPdfUrl("");
      showToast(e?.message || "PDF আপলোড ব্যর্থ হয়েছে", "error");
    } finally {
      setIsUploadingPdf(false);
    }
  };




  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [user, router, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, categoriesRes, authorsRes, publishersRes] = await Promise.all([
        api.get(`/books?page=${page}&limit=10`),
        api.get("/categories?limit=50"),
        api.get("/authors?limit=50"),
        api.get("/publishers?limit=50"),
      ]);

      setBooks(booksRes.data?.data || []);
      setTotalPages(booksRes.data?.meta?.totalPages || 1);
      setCategories(categoriesRes.data?.data || []);
      setAuthors(authorsRes.data?.data || []);
      setPublishers(publishersRes.data?.data || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load book data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingId(book._id);
      setFormData({
        title: book.title,
        slug: book.slug,
        description: book.description || "",
        author: typeof book.author === "string" ? book.author : book.author._id,
        category: typeof book.category === "string" ? book.category : book.category._id,
        publisher: typeof book.publisher === "string" ? book.publisher : book.publisher._id,
        price: book.price.toString(),
        stock: book.stock.toString(),
        bookPage: book.bookPage?.toString() || "0",
        weight: book.weight?.toString() || "0",
        edition: book.edition?.toString() || "1",
        coverImage: book.coverImage?.toString(),
        previewPdf: book.previewPdf?.toString() || "",
      });
      setCoverFile(null);
      setPreviewPdf(null);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setCoverFile(null);
      setPreviewPdf(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setCoverFile(null);
    setPreviewPdf(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim() || !formData.author || !formData.category || !formData.publisher || formData.price === "" || formData.weight === "") {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("slug", formData.slug);
      payload.append("description", formData.description);
      payload.append("author", formData.author);
      payload.append("category", formData.category);
      payload.append("publisher", formData.publisher);
      payload.append("price", formData.price || "0");
      payload.append("stock", formData.stock || "0");
      payload.append("bookPage", formData.bookPage || "0"); 
      payload.append("weight", formData.weight || "0"); 
      payload.append("edition", formData.edition || "1");

      if (coverFile) payload.append("coverImage", coverFile);
      if (previewPdfUrl) payload.append("previewPdfUrl", previewPdfUrl);


      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
        showToast("Book updated successfully", "success");
      } else {
        await api.post("/books", payload);
        showToast("Book created successfully", "success");
      }

      handleCloseModal();
      setPage(1);
      fetchData();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || "Failed to save book", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/books/${id}`);
      showToast("Book deleted successfully", "success");
      fetchData();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || "Failed to delete book", "error");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Books</h1>
            <p className="text-gray-600 dark:text-gray-300">Create, edit, and delete books for your store.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
          >
            <FiPlus className="w-4 h-4" /> Add Book
          </button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Author</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Publisher</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Stock</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading books...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">No books found</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{book.title}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{typeof book.author === "string" ? book.author : book.author.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{typeof book.category === "string" ? book.category : book.category.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{typeof book.publisher === "string" ? book.publisher : book.publisher.name}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{book.price}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{book.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(book)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 transition"
                          aria-label="Edit book"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-slate-600 transition"
                          aria-label="Delete book"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingId ? "Edit Book" : "Add Book"}</h2>
                  <p className="text-gray-500 dark:text-gray-400">Fill in book details and save.</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Title *</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Slug *</label>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Author *</label>
                  <select
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Select author</option>
                    {authors.map((author) => (
                      <option key={author._id} value={author._id}>{author.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Publisher *</label>
                  <select
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="">Select publisher</option>
                    {publishers.map((publisher) => (
                      <option key={publisher._id} value={publisher._id}>{publisher.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Price *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                      placeholder="বইয়ের বিস্তারিত বিবরণ লিখুন..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Cover Image</label>
                  <label className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <span>{coverFile ? coverFile.name : "Choose cover image"}</span>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Browse</span>
                    <input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>
                  {coverFile && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected: {coverFile.name}</div>
                  )}
                  {!coverFile && editingId && formData.coverImage && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 rounded-lg bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5">
                      <span className="truncate">Existing image saved</span>
                      <a href={formData.coverImage} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium shrink-0">View</a>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                    বইয়ের প্রিভিউ (PDF)
                  </label>
                  <label className="mt-2 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <span className="truncate max-w-[200px] sm:max-w-xs">
                      {previewPdf ? previewPdf.name : "পিডিএফ ফাইল সিলেক্ট করুন"}
                    </span>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shrink-0">
                      Browse
                    </span>
                    <input
                      type="file"
                      name="previewPdf"
                      accept="application/pdf"
                      multiple={false}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPreviewPdf(file);
                        setPreviewPdfUrl("");

                        if (file) {
                          // Upload immediately to avoid sending multipart to backend.
                          void uploadPreviewPdf(file);
                        }
                      }}
                      className="sr-only"
                    />
                  </label>


                  {previewPdf && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 rounded-lg bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate">{previewPdf.name}</span>
                        {isUploadingPdf && (
                          <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                            Uploading...
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPdf(null);
                          setPreviewPdfUrl("");
                          setIsUploadingPdf(false);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  )}

                  {!previewPdf && editingId && formData.previewPdf && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 rounded-lg bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5">
                      <span className="truncate">Existing PDF</span>
                      <a
                        href={formData.previewPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 font-medium shrink-0"
                      >
                        View
                      </a>
                    </div>
                  )}

                </div>
                
                <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      পৃষ্ঠা সংখ্যা (Page)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="উদা: ৩২০"
                      value={formData.bookPage}
                      onChange={(e) => setFormData({ ...formData, bookPage: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      সংস্করণ (Edition)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="উদা: ১"
                      value={formData.edition}
                      onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      ওজন (গ্রাম হিসেবে)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="উদা: ২৫০"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-gray-900 dark:border-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingPdf}
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    {isUploadingPdf ? "Uploading PDF..." : editingId ? "Update Book" : "Create Book"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}