import { Types } from 'mongoose';

export type TOrderItem = {
  book: Types.ObjectId;
  quantity: number;
  price: number; // order দেওয়ার সময়কার মূল্য
};

export type TOrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type TPaymentStatus = 'pending' | 'approved';

export type TOrder = {
  orderId?: string;
  // Customer info
  name: string;
  phone: string;
  email?: string;
  address: string;
  thana: string;
  district: string;
  // User (optional — guest হলে থাকবে না)
  user?: Types.ObjectId;
  isGuest?: boolean;
  // Items
  items: TOrderItem[];
  // Pricing
  subtotal?: number;
  shippingCharge?: number;
  grandTotal?: number;
  // Payment
  paymentProof?: string;
  paymentStatus?: TPaymentStatus;
  // Order
  orderStatus?: TOrderStatus;
  adminNote?: string;
};
