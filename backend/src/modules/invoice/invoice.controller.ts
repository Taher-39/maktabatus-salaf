import { Request, Response, NextFunction } from 'express';
import { generateInvoiceService, getPDFStream } from './invoice.service';
import { sendResponse } from '../../utils/sendResponse';

// Download invoice
export const downloadInvoiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user._id;

    // Generate PDF
    const doc = await generateInvoiceService(orderId);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="invoice-${orderId}.pdf"`
    );

    // Send PDF
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};

// View invoice preview (optional - returns HTML preview)
export const viewInvoiceHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const doc = await generateInvoiceService(orderId);

    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
};
