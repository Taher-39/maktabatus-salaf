import { AppError } from '../../middlewares/errorHandler';
import { TOrder } from './order.interface';
import { Order } from './order.model';

// ─── Create Order ────────────────────────────────────────────────────────────
const createOrder = async (payload: TOrder) => {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Shipping charge by total weight slab
  // weight <= 1kg => 90tk
  // (1,2] => 110tk
  // (2,3] => 130tk
  // +20tk per 1kg slab afterwards.
  // NOTE: Assumes Book.weight is in kg.
  const itemsWithBooks = await Promise.all(
    payload.items.map(async (it) => {
      const book = await (await import('../book/book.model')).Book.findById(it.book).select('weight');
      return { quantity: it.quantity, unitWeight: book?.weight ?? 0 };
    })
  );

  const totalWeightKg = itemsWithBooks.reduce(
    (sum, it) => sum + it.unitWeight * it.quantity,
    0
  );

  let shippingCharge = 0;
  if (totalWeightKg <= 1) {
    shippingCharge = 90;
  } else if (totalWeightKg <= 2) {
    shippingCharge = 110;
  } else if (totalWeightKg <= 3) {
    shippingCharge = 130;
  } else {
    // Above 3kg: 20tk per additional 1kg slab
    // Example: 3.1kg => extraKgCeil = 1 => 150tk
    const extraKg = Math.ceil(totalWeightKg - 3);
    shippingCharge = 130 + extraKg * 20;
  }

  const grandTotal = subtotal + shippingCharge;

  const paymentStatus =
    payload?.paymentMethod === 'COD' ? 'approved' : 'pending';

  const order = await Order.create({
    ...payload,
    paymentStatus,
    orderStatus: 'pending',
    subtotal,
    shippingCharge,
    grandTotal,
    isGuest: !payload.user,
  });


  return order;
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
const getAllOrders = async (query: Record<string, unknown>) => {
  const {
    page = 1,
    limit = 10,
    orderStatus,
    paymentStatus,
    search,
  } = query;

  const filter: Record<string, unknown> = {};

  if (orderStatus) filter.orderStatus = orderStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { orderId: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .populate('items.book', 'title coverImage price')
    .populate('user', 'name phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    data: orders,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

// ─── Get My Orders (Customer) ─────────────────────────────────────────────────
const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate('items.book', 'title coverImage price')
    .sort({ createdAt: -1 });

  return orders;
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
const getSingleOrder = async (id: string) => {
  const order = await Order.findById(id)
    .populate('items.book', 'title coverImage price author')
    .populate('user', 'name phone');

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
};

// ─── Get Order by orderId (e.g. MS-00001) ────────────────────────────────────
const getOrderByOrderId = async (orderId: string) => {
  const order = await Order.findOne({ orderId })
    .populate('items.book', 'title coverImage price')
    .populate('user', 'name phone');

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
};

// ─── Update Order / Payment Status (Admin) ───────────────────────────────────
const updateOrderStatus = async (
  id: string,
  payload: {
    orderStatus?: string;
    paymentStatus?: string;
    adminNote?: string;
  }
) => {
  const order = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
};

// ─── Upload Payment Proof (Customer) ─────────────────────────────────────────
const uploadPaymentProof = async (id: string, proofUrl: string) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { 
      paymentProof: proofUrl,
      paymentStatus: 'pending' // Set to pending until admin approves
    },
    { new: true }
  );

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
};

// ─── Approve Payment (Admin) ──────────────────────────────────────────────────
const approvePayment = async (id: string) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  if (!order.paymentProof) {
    throw new AppError('এই অর্ডারে কোনো পেমেন্ট প্রমাণ নেই', 400);
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { paymentStatus: 'approved' },
    { new: true }
  );

  return updatedOrder;
};

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────
const getOrderStats = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$grandTotal' },
      },
    },
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'approved' } },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);

  return {
    byStatus: stats,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};

// ─── Delete Order (Admin) ─────────────────────────────────────────────────────
const deleteOrder = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  getOrderByOrderId,
  updateOrderStatus,
  uploadPaymentProof,
  approvePayment,
  getOrderStats,
  deleteOrder,
};
