import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middlewares/errorHandler';
import { Order } from './order.model';
import { sendResponse } from '../../utils/sendResponse';
import { createSslCommerzPayment } from './order.sslcommerz.service';

// Create SSLCOMMERZ payment session for an order
export const createSslcommerzSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await Order.findById(id);

    if (!order) throw new AppError('অর্ডার পাওয়া যায়নি', 404);

    // Build + call SSLCOMMERZ
    const result = await createSslCommerzPayment(order);

    // Persist tran_id for webhook matching
    order.tran_id = result.tran_id;
    order.paymentGateway = 'sslcommerz';
    await order.save();

    sendResponse(
      res,
      200,
      'SSLCOMMERZ পেমেন্ট সেশন তৈরি হয়েছে',
      { redirectGatewayURL: result.redirectGatewayURL, tran_id: result.tran_id }
    );
  } catch (err) {
    next(err);
  }
};

// SSLCOMMERZ callback/webhook
export const sslcommerzCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // SSLCOMMERZ gateway sends different field casings depending on status/callback.
    // tran_id is the most important field to match order.
    const tranId =
      req.body?.tran_id ||
      req.body?.tranId ||
      req.body?.transaction_id ||
      req.body?.tran_id_value;

    if (!tranId) {
      throw new AppError(
        `SSLCOMMERZ callback: tran_id নেই. body keys: ${Object.keys(req.body || {}).join(
          ', '
        )}`,
        400
      );
    }

    const order = await Order.findOne({ tran_id: tranId });
    if (!order) throw new AppError('অর্ডার পাওয়া যায়নি', 404);

    // Based on SSLCOMMERZ fields: common approval indicators.
    // Do NOT rely on a single field name.
    const isApproved =
      req.body?.status === 'VALID' ||
      req.body?.status === 'success' ||
      req.body?.payment_status === 'Successful' ||
      req.body?.payment_status === 'successful' ||
      req.body?.tran_date;

    if (isApproved) {
      order.paymentStatus = 'approved';
      // Keep orderStatus unchanged; admin can approve/ship later if needed.
    }

    order.paymentGatewayData = req.body;
    await order.save();

    // SSLCOMMERZ expects 200 response
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
};

