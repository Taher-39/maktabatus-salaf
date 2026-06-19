import { Request, Response, NextFunction } from 'express';
import { generateInvoiceService } from './invoice.service';
import { AppError } from '../../middlewares/errorHandler';
import { downloadInvoiceSchema } from './invoice.validation';

// Download invoice as PDF
export const downloadInvoiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    // Validate input
    const parsed = downloadInvoiceSchema.safeParse({ orderId });
    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    // Generate PDF
    const doc = await generateInvoiceService(orderId);

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${orderId}.pdf"`
    );

    // Send PDF stream to client
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};

// View invoice preview (sends PDF to browser display, not download)
export const viewInvoiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    // Validate input
    const parsed = downloadInvoiceSchema.safeParse({ orderId });
    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    // Generate PDF
    const doc = await generateInvoiceService(orderId);

    // Set response headers for inline view
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${orderId}.pdf"`);

    // Send PDF stream to client
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};
