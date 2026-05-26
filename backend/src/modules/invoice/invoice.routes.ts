import { Router } from 'express';
import {
  downloadInvoiceHandler,
  viewInvoiceHandler
} from './invoice.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Download invoice as PDF (require auth)
router.get('/:orderId/download', protect, downloadInvoiceHandler);

// View invoice preview (require auth)
router.get('/:orderId/preview', protect, viewInvoiceHandler);

export default router;
