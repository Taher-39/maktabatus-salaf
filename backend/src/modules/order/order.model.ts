import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'পরিমাণ কমপক্ষে ১ হতে হবে'],
    },
    price: {
      type: Number,
      required: true, // order দেওয়ার সময়কার মূল্য সেভ করি
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    // Customer info
    name: { type: String, required: [true, 'নাম দিন'] },
    phone: { type: String, required: [true, 'ফোন নম্বর দিন'] },
    email: { type: String },
    address: { type: String, required: [true, 'ঠিকানা দিন'] },
    thana: { type: String, required: [true, 'থানা দিন'] },
    district: { type: String, required: [true, 'জেলা দিন'] },
    // User reference (logged-in হলে থাকবে)
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isGuest: { type: Boolean, default: true },
    // Order items
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: 'কমপক্ষে একটি বই লাগবে',
      },
    },
    // Pricing
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 40 },
    grandTotal: { type: Number, required: true },
    // Payment
    paymentProof: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },

    // SSLCOMMERZ / Gateway
    tran_id: { type: String, default: null },
    paymentGateway: { type: String, default: null },
    paymentGatewayData: { type: Schema.Types.Mixed, default: null },
    // Order status
    orderStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    adminNote: { type: String, default: null },
  },
  { timestamps: true }
);

// Auto orderId generate: MS-00001, MS-00002 ...
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await Order.countDocuments();
    this.orderId = `MS-${String(count + 1).padStart(5, '0')}`;
  }
});

export const Order = model('Order', orderSchema);
