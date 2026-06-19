"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useToast } from "@/components/shared/ToastProvider";
import { Book, Category, Author, Publisher } from "@/lib/types";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const initialFormState = {
  title: "",
  slug: "",
  description: "",
  author: "",
  category: "",
  publisher: "",
  price: "",
  stock: "",
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
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

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
        api.get("/categories?limit=100"),
        api.get("/authors?limit=100"),
        api.get("/publishers?limit=100"),
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
      });
      setCoverFile(null);
      setPreviewFiles([]);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setCoverFile(null);
      setPreviewFiles([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
    setCoverFile(null);
    setPreviewFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim() || !formData.author || !formData.category || !formData.publisher) {
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

      if (coverFile) payload.append("coverImage", coverFile);
      previewFiles.forEach((file) => payload.append("previewPages", file));

      if (editingId) {
        await api.put(`/books/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Book updated successfully", "success");
      } else {
        await api.post("/books", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600 transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900">
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
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="mt-2 w-full text-sm text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Preview Pages</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => setPreviewFiles(Array.from(e.target.files || []))}
                    className="mt-2 w-full text-sm text-gray-900 dark:text-gray-100"
                  />
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
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    {editingId ? "Update Book" : "Create Book"}
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
