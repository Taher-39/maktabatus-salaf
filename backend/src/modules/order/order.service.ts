import { AppError } from '../../middlewares/errorHandler';
import { TOrder } from './order.interface';
import { Order } from './order.model';

// ─── Create Order ────────────────────────────────────────────────────────────
const createOrder = async (payload: TOrder) => {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCharge = 40;
  const grandTotal = subtotal + shippingCharge;

  const order = await Order.create({
    ...payload,
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
    { paymentProof: proofUrl },
    { new: true }
  );

  if (!order) {
    throw new AppError('অর্ডার পাওয়া যায়নি', 404);
  }

  return order;
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
  getOrderStats,
  deleteOrder,
};
