import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middlewares/errorHandler';
import { env } from '../../config/env';
import { Order } from './order.model';
import { sendResponse } from '../../utils/sendResponse';
import {
  createSslCommerzPayment,
  validateSslCommerzPayment,
} from './order.sslcommerz.service';

const getGatewayPayload = (req: Request): Record<string, any> => ({
  ...(req.query || {}),
  ...(req.body || {}),
});

const getTranId = (payload: Record<string, any>) =>
  payload?.tran_id || payload?.tranId || payload?.transaction_id || payload?.tran_id_value;

const getFrontendRedirectUrl = (
  status: 'success' | 'fail' | 'cancel',
  payload: Record<string, any>
) => {
  const url = new URL(`/sslcommerz/${status}`, env.CLIENT_URL);
  if (payload?.status) url.searchParams.set('status', String(payload.status));
  if (payload?.tran_id) url.searchParams.set('tran_id', String(payload.tran_id));
  return url.toString();
};

const persistGatewayResult = async (
  payload: Record<string, any>,
  options: { requireValidPayment: boolean }
) => {
  const tranId = getTranId(payload);

  if (!tranId) {
    throw new AppError(
      `SSLCOMMERZ callback: tran_id missing. payload keys: ${Object.keys(payload || {}).join(
        ', '
      )}`,
      400
    );
  }

  const order = await Order.findOne({ tran_id: tranId });
  if (!order) throw new AppError('Order not found for this SSLCOMMERZ transaction', 404);

  let validationData: Record<string, any> | null = null;
  let isApproved = false;

  if (options.requireValidPayment) {
    const validation = await validateSslCommerzPayment(payload, order);
    validationData = validation.data;
    isApproved = validation.isValid;
  }

  if (isApproved) {
    order.paymentStatus = 'approved';
  }

  order.paymentGateway = 'sslcommerz';
  order.paymentGatewayData = {
    callback: payload,
    validation: validationData,
  };
  await order.save();

  return { order, isApproved };
};

export const createSslcommerzSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await Order.findById(id);

    if (!order) throw new AppError('Order not found', 404);

    const result = await createSslCommerzPayment(order);

    order.tran_id = result.tran_id;
    order.paymentGateway = 'sslcommerz';
    await order.save();

    sendResponse(res, 200, 'SSLCOMMERZ payment session created', {
      redirectGatewayURL: result.redirectGatewayURL,
      tran_id: result.tran_id,
    });
  } catch (err) {
    next(err);
  }
};

export const sslcommerzCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await persistGatewayResult(getGatewayPayload(req), { requireValidPayment: true });
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
};

export const sslcommerzSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const payload = getGatewayPayload(req);

  try {
    const result = await persistGatewayResult(payload, { requireValidPayment: true });
    res.redirect(getFrontendRedirectUrl(result.isApproved ? 'success' : 'fail', payload));
  } catch (err) {
    next(err);
  }
};

export const sslcommerzFail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const payload = getGatewayPayload(req);

  try {
    await persistGatewayResult(payload, { requireValidPayment: false });
    res.redirect(getFrontendRedirectUrl('fail', payload));
  } catch (err) {
    next(err);
  }
};

export const sslcommerzCancel = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const payload = getGatewayPayload(req);

  try {
    await persistGatewayResult(payload, { requireValidPayment: false });
    res.redirect(getFrontendRedirectUrl('cancel', payload));
  } catch (err) {
    next(err);
  }
};
