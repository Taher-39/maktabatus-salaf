import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { Order } from '../order/order.model';
import { AppError } from '../../utils/sendResponse';

interface InvoiceData {
  invoiceId: string;
  date: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCharge: number;
  total: number;
}

export const generateInvoiceService = async (orderId: string): Promise<PDFDocument> => {
  try {
    // Get order details
    const order = await Order.findById(orderId).populate('items.book').populate('user');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      invoiceId: order._id.toString(),
      date: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        address: order.shippingAddress?.address || 'N/A'
      },
      items: order.items.map((item: any) => ({
        title: item.book.title,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.totalPrice,
      shippingCharge: 40,
      total: order.totalPrice + 40
    };

    // Create PDF document
    const doc = new PDFDocument({
      bufferPages: true,
      size: 'A4',
      margin: 40
    });

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('INVOICE', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Maktabatus Salaf', { align: 'center' })
      .text('Online Book Store', { align: 'center' })
      .text('Call: +880-XXX-XXX-XXXX | Email: info@maktabatus-salaf.com', { align: 'center' })
      .moveDown(1);

    // Invoice details
    doc
      .fontSize(10)
      .text(`Invoice Number: ${invoiceData.invoiceId}`, 50)
      .text(`Invoice Date: ${invoiceData.date.toLocaleDateString('bn-BD')}`);

    doc.moveTo(50, doc.y + 10).lineTo(550, doc.y + 10).stroke();
    doc.moveDown(1);

    // Customer details
    doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50);
    doc.font('Helvetica').fontSize(9);
    doc.text(invoiceData.customer.name, 50);
    doc.text(`Phone: ${invoiceData.customer.phone}`, 50);
    doc.text(`Email: ${invoiceData.customer.email}`, 50);
    doc.text(invoiceData.customer.address, 50);

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Items table header
    const startX = 50;
    const colWidth = 120;
    const row1Y = doc.y;

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Item', startX, row1Y);
    doc.text('Qty', startX + colWidth * 2, row1Y);
    doc.text('Price (৳)', startX + colWidth * 3, row1Y);
    doc.text('Total (৳)', startX + colWidth * 4, row1Y);

    doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
    doc.moveDown(1);

    // Items
    doc.fontSize(8).font('Helvetica');
    invoiceData.items.forEach((item) => {
      const itemY = doc.y;
      doc.text(item.title.substring(0, 25), startX, itemY, { width: colWidth });
      doc.text(item.quantity.toString(), startX + colWidth * 2, itemY);
      doc.text(item.price.toString(), startX + colWidth * 3, itemY);
      doc.text((item.quantity * item.price).toString(), startX + colWidth * 4, itemY);
      doc.moveDown(1.5);
    });

    // Totals
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(9).font('Helvetica');
    const subtotalY = doc.y;
    doc.text('Subtotal:', startX + colWidth * 3, subtotalY);
    doc.text(`৳ ${invoiceData.subtotal.toFixed(2)}`, startX + colWidth * 4, subtotalY);

    doc.moveDown(0.5);
    const shippingY = doc.y;
    doc.text('Shipping Charge:', startX + colWidth * 3, shippingY);
    doc.text(`৳ ${invoiceData.shippingCharge.toFixed(2)}`, startX + colWidth * 4, shippingY);

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(11);
    const totalY = doc.y;
    doc.text('TOTAL:', startX + colWidth * 3, totalY);
    doc.text(`৳ ${invoiceData.total.toFixed(2)}`, startX + colWidth * 4, totalY);

    // Footer
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(8).font('Helvetica');
    doc.text('Thank you for your purchase!', { align: 'center' });
    doc.text('For any inquiries, please contact us at info@maktabatus-salaf.com', { align: 'center' });

    return doc;
  } catch (error) {
    throw error;
  }
};

// Convert PDFDocument to stream
export const getPDFStream = (doc: PDFDocument): Readable => {
  return doc as any;
};
