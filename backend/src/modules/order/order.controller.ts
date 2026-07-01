import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../middlewares/errorHandler';
import { uploadBufferToCloudinary } from '../../utils/cloudinaryUpload';
import { OrderService } from './order.service';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  uploadPaymentProofSchema,
} from './order.validation';

// ─── Create Order ─────────────────────────────────────────────────────────────
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    // Logged-in user হলে user id attach করি
    const orderData = {
      ...parsed.data,
      user: req.user?.userId,
    } as any;

    const result = await OrderService.createOrder(orderData);

    sendResponse(res, 201, 'অর্ডার সফলভাবে সম্পন্ন হয়েছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getAllOrders(req.query);

    sendResponse(res, 200, 'সকল অর্ডার পাওয়া গেছে', result.data, result.meta);
  } catch (err) {
    next(err);
  }
};

// ─── Get My Orders (Customer) ─────────────────────────────────────────────────
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getMyOrders(req.user?.userId || '');

    sendResponse(res, 200, 'আপনার অর্ডারসমূহ পাওয়া গেছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await OrderService.getSingleOrder(id);

    sendResponse(res, 200, 'অর্ডার বিবরণ পাওয়া গেছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Get Order by orderId (MS-00001) ─────────────────────────────────────────
export const getOrderByOrderId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;
    const result = await OrderService.getOrderByOrderId(orderId);

    sendResponse(res, 200, 'অর্ডার পাওয়া গেছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Update Status (Admin) ────────────────────────────────────────────────────
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await OrderService.updateOrderStatus(id, parsed.data);

    sendResponse(res, 200, 'অর্ডার স্ট্যাটাস আপডেট হয়েছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Upload Payment Proof (Customer) ─────────────────────────────────────────
export const uploadPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('পেমেন্ট প্রমাণ (ছবি) আপলোড করুন', 400);
    }

    const file = req.file as Express.Multer.File;
    const proofUrl = await uploadBufferToCloudinary(
      file.buffer,
      'maktabatus-salaf/payments',
      'image'
    );
    const result = await OrderService.uploadPaymentProof(id, proofUrl);

    sendResponse(
      res,
      200,
      'পেমেন্ট প্রমাণ সফলভাবে আপলোড হয়েছে। এডমিন শীঘ্রই অনুমোদন করবেন।',
      result
    );
  } catch (err) {
    next(err);
  }
};

// ─── Approve Payment (Admin) ──────────────────────────────────────────────────
export const approvePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await OrderService.approvePayment(id);

    sendResponse(
      res,
      200,
      'পেমেন্ট অনুমোদিত হয়েছে। অর্ডার শীঘ্রই প্রসেস করা হবে।',
      result
    );
  } catch (err) {
    next(err);
  }
};

// ─── Dashboard Stats (Admin) ──────────────────────────────────────────────────
export const getOrderStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await OrderService.getOrderStats();

    sendResponse(res, 200, 'অর্ডার পরিসংখ্যান পাওয়া গেছে', result);
  } catch (err) {
    next(err);
  }
};

// ─── Delete Order (Admin) ─────────────────────────────────────────────────────
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await OrderService.deleteOrder(id);

    sendResponse(res, 200, 'অর্ডার মুছে ফেলা হয়েছে', null);
  } catch (err) {
    next(err);
  }
};
