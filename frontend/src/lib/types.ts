export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Category {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  image?: string;
}

export interface Publisher {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: Author | string;
  category: Category | string;
  publisher: Publisher | string;
  price: number;
  stock: number;
  coverImage: string;
  previewPages?: string[];
  soldCount: number;
  viewCount: number;
  isActive: boolean;
  createdAt?: string;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: "customer" | "admin";
  address?: {
    village?: string;
    thana?: string;
    district?: string;
  };
}

export interface AuthResponse {
  _id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
  token: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  book: Book | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  thana: string;
  district: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "approved";
  paymentProof?: string;
  createdAt: string;
}

export interface BookQueryParams {
  search?: string;
  category?: string;
  author?: string;
  publisher?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderPayload {
  name: string;
  phone: string;
  email?: string;
  address: string;
  thana: string;
  district: string;
  items: { book: string; quantity: number; price: number }[];
}
