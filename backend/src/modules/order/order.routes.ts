import express from 'express';
import { protect, adminOnly } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import * as OrderController from './order.controller';
import { createSslcommerzSession, sslcommerzCallback } from './order.sslcommerz.controller';

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

// PATCH /api/orders/:id/approve-payment — approve payment by admin
router.patch(
  '/:id/approve-payment',
  protect,
  adminOnly,
  OrderController.approvePayment
);

// ──────────────────────────────────────────────────────────────
// CUSTOMER ROUTES (Auth required)
// ──────────────────────────────────────────────────────────────

// GET /api/orders/my-orders — আমার অর্ডারসমূহ
router.get('/my-orders', protect, OrderController.getMyOrders);

// GET /api/orders/track/:orderId — orderId দিয়ে track করো (MS-00001)
router.get('/track/:orderId', OrderController.getOrderByOrderId);

// PATCH /api/orders/:id/payment-proof — payment proof upload (with file)
router.patch(
  '/:id/payment-proof',
  protect,
  upload.single('paymentProof'),
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

// SSLCOMMERZ
// Create payment session (returns redirect URL)
router.post('/:id/sslcommerz-session', createSslcommerzSession);

// Callback/webhook URL for SSLCOMMERZ server-to-server updates
router.post('/sslcommerz/callback', sslcommerzCallback);

export default router;
