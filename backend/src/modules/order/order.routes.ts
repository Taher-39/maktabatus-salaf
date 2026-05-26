import express from 'express';
import { protect, adminOnly } from '../../middlewares/auth.middleware';
import * as OrderController from './order.controller';

const router = express.Router();

// ──────────────────────────────────────────────────────────────
// PUBLIC ROUTES (Guest + Customer)
// ──────────────────────────────────────────────────────────────

// POST /api/orders — অর্ডার করো (guest বা logged-in উভয়ই পারবে)
router.post(
  '/',
  OrderController.createOrder
);

// ──────────────────────────────────────────────────────────────
// ADMIN ROUTES (must come before /:id routes)
// ──────────────────────────────────────────────────────────────

// GET /api/orders — সকল অর্ডার (filter, search, pagination সহ)
router.get('/', protect, adminOnly, OrderController.getAllOrders);

// GET /api/orders/stats — dashboard stats
router.get('/stats', protect, adminOnly, OrderController.getOrderStats);

// ──────────────────────────────────────────────────────────────
// CUSTOMER ROUTES (Auth required)
// ──────────────────────────────────────────────────────────────

// GET /api/orders/my-orders — আমার অর্ডারসমূহ
router.get('/my-orders', protect, OrderController.getMyOrders);

// GET /api/orders/track/:orderId — orderId দিয়ে track করো (MS-00001)
router.get('/track/:orderId', OrderController.getOrderByOrderId);

// PATCH /api/orders/:id/payment-proof — payment proof upload
router.patch(
  '/:id/payment-proof',
  protect,
  OrderController.uploadPaymentProof
);

// PATCH /api/orders/:id/status — status update (pending→shipped→delivered)
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  OrderController.updateOrderStatus
);

// DELETE /api/orders/:id
router.delete('/:id', protect, adminOnly, OrderController.deleteOrder);

// GET /api/orders/:id — single order details (customer নিজের, admin যেকোনো)
router.get('/:id', OrderController.getSingleOrder);

export default router;