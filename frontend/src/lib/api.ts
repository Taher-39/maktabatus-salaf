import axios from "axios";
import type {
  ApiResponse,
  AuthResponse,
  Book,
  BookQueryParams,
  Category,
  CreateOrderPayload,
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
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

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

export async function getCategories() {
  const { data } = await api.get<ApiResponse<Category[]>>("/categories");
  return data;
}

export async function login(phone: string, password: string) {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    phone,
    password,
  });
  return data;
}

export async function register(payload: {
  idToken: string;
  name: string;
  password: string;
  address?: { village?: string; thana?: string; district?: string };
}) {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/verify-otp",
    payload
  );
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

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await api.post<ApiResponse<Order>>("/orders", payload);
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

// একটা নির্দিষ্ট বইয়ের রিভিউ (pagination সহ)
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
