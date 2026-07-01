import axios from "axios";
import type {
  ApiResponse,
  Author,
  AuthResponse,
  Book,
  BookQueryParams,
  Category,
  CreateOrderPayload,
  Publisher,
  CreateReviewPayload,
  Order,
  Review,
  ReviewQueryParams,
  User,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function getAuthors(params?: any) {
  const { data } = await api.get<ApiResponse<Author[]>>("/authors", { params });
  return data;
}

export async function getAuthorBySlug(slug: string) {
  const { data } = await api.get<ApiResponse<Author>>(`/authors/${slug}`);
  return data;
}

// ─── Banners ────────────────────────────────────────────────────────────────────

export interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  position: "hero" | "featured" | "promotion";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export async function getActiveBanners(position?: string) {
  const { data } = await api.get<ApiResponse<Banner[]>>("/banners/active", {
    params: position ? { position } : undefined,
  });
  return data;
}

// ─── Blogs ──────────────────────────────────────────────────────────────────────

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  tags: string[];
  likes: number;
  views: number;
  category?: string;
  author?: string | { _id?: string; name?: string; email?: string };
  isPublished?: boolean;
  createdAt: string;
}

export interface BlogQueryParams {
  search?: string;
  category?: string;
  author?: string;
  status?: "published" | "draft" | "all";
  sortBy?: "newest" | "oldest" | "views_asc" | "views_desc" | "likes_asc" | "likes_desc";
  page?: number;
  limit?: number;
}

export async function getBlogs(params?: BlogQueryParams) {
  const { data } = await api.get<any>("/blogs", { params });
  return data;
}


export async function getBlogBySlug(slug: string) {
  const { data } = await api.get<ApiResponse<Blog>>(`/blogs/${slug}`);
  return data;
}

export async function getBlogById(id: string) {
  const { data } = await api.get<ApiResponse<Blog>>(`/blogs/id/${id}`);
  return data;
}

export async function createBlog(payload: { title: string; excerpt: string; content: string; category: string; image?: string; isPublished?: boolean }) {
  const { data } = await api.post<ApiResponse<Blog>>("/blogs", payload);
  return data;
}

export async function updateBlog(id: string, payload: Partial<{ title: string; excerpt: string; content: string; category: string; image: string; isPublished: boolean }>) {
  const { data } = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, payload);
  return data;
}

export async function deleteBlog(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/blogs/${id}`);
  return data;
}

export async function likeBlog(id: string) {
  const { data } = await api.patch<ApiResponse<Blog>>(`/blogs/${id}/like`);
  return data;
}

// ─── Reviews (public, without auth, for testimonials) ────────────────────────────

export async function getAllReviews(params?: { page?: number; limit?: number; rating?: number }) {
  const { data } = await api.get<ApiResponse<Review[]>>("/reviews", { params });
  return data;
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export async function getDashboardStats() {
  const { data } = await api.get<ApiResponse<DashboardStats>>("/orders/stats");
  return data;
}

// ─── Books ─────────────────────────────────────────────────────────────────────

export async function getBooks(params?: BookQueryParams) {
  const { data } = await api.get<ApiResponse<Book[]>>("/books", { params });
  return data;
}

export async function getPopularBooks() {
  const { data } = await api.get<ApiResponse<Book[]>>("/books/popular");
  return data;
}

export async function getNewBooks() {
  const { data } = await api.get<ApiResponse<Book[]>>("/books/new");
  return data;
}

export async function getBookBySlug(slug: string) {
  const { data } = await api.get<ApiResponse<Book>>(`/books/${slug}`);
  return data;
}

export async function getAuthorBooksById(id: string) {
  const { data } = await api.get<ApiResponse<Book[]>>(`/books/authors/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await api.get<ApiResponse<Category[]>>("/categories");
  return data;
}

export async function getPublishers(params?: any) {
  const { data } = await api.get<ApiResponse<Publisher[]>>("/publishers", { params });
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────── 
export async function socialLogin(idToken: string) {
  const { data } = await api.post<ApiResponse<any>>("/auth/social-login", { idToken });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email, 
    password,
  });
  return data;
}

export async function sendOtp(email: string, name: string) {
  const { data } = await api.post<ApiResponse<any>>("/auth/send-otp", { email, name });
  return data;
}

export async function register(payload: {
  email: string;
  name: string;
  password: string;
  otp: string; 
}) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/verify-otp", payload);
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  const { data } = await api.post("/auth/change-password", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data;
}

export async function logout() {
  const { data } = await api.post<ApiResponse<null>>("/auth/logout");
  return data;
}

// ─── Users (Admin) ─────────────────────────────────────────────────────────
export async function getUsers(params?: { page?: number; limit?: number; search?: string; isBanned?: boolean }) {
  const { data } = await api.get<ApiResponse<User[]>>("/users", { params });
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data;
}

export async function banToggleUser(id: string) {
  const { data } = await api.patch<ApiResponse<any>>(`/users/${id}/ban`);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
  return data;
}

export async function changeUserRole(id: string, role: "admin" | "customer") {
  const { data } = await api.patch<ApiResponse<any>>(`/users/${id}/role`, { role });
  return data;
}


// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload & { paymentMethod?: "COD" | "SSLCOMMERZ" }) {
  const { data } = await api.post<ApiResponse<Order>>("/orders", payload);
  return data;
}

export async function createSslcommerzSession(orderId: string) {
  const { data } = await api.post<ApiResponse<{ redirectGatewayURL: string; tran_id: string }>>(
    `/orders/${orderId}/sslcommerz-session`
  );
  return data;
}


export async function getMyOrders() {
  const { data } = await api.get<ApiResponse<Order[]>>("/orders/my-orders");
  return data;
}

export async function trackOrder(orderId: string) {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/track/${orderId}`);
  return data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return data;
}

export async function getVideos(limit: number = 6) {
  try {
    const { data } = await api.get<ApiResponse<any[]>>("/videos", {
      params: { limit },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { success: false, data: [] };
  }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getBookReviews(bookId: string, params?: ReviewQueryParams) {
  const { data } = await api.get<ApiResponse<Review[]>>(
    `/reviews/book/${bookId}`,
    { params }
  );
  return data;
}

// রিভিউ তৈরি — logged-in user only (token interceptor automatically attach করবে)
export async function createReview(payload: CreateReviewPayload) {
  const { data } = await api.post<ApiResponse<Review>>("/reviews", payload);
  return data;
}
