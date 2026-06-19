import PDFDocument from 'pdfkit-table';
import { Readable } from 'stream';
import { Order } from '../order/order.model';
import { AppError } from '../../middlewares/errorHandler';

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

export const generateInvoiceService = async (orderId: string): Promise<InstanceType<typeof PDFDocument>> => {
  try {
    // Get order details
    const order = await Order.findById(orderId).populate('items.book');

    if (!order) {
      throw new AppError('অর্ডার পাওয়া যায়নি', 404);
    }

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      invoiceId: order.orderId || order._id.toString(),
      date: order.createdAt || new Date(),
      customer: {
        name: order.name,
        email: order.email || 'N/A',
        phone: order.phone,
        address: order.address
      },
      items: order.items.map((item: any) => ({
        title: item.book?.title || 'Unknown',
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      total: order.grandTotal
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

    doc
      .moveTo(50, doc.y + 10)
      .lineTo(550, doc.y + 10)
      .stroke();
    doc.moveDown(1);

    // Customer details
    doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50);
    doc.font('Helvetica').fontSize(9);
    doc.text(invoiceData.customer.name, 50);
    doc.text(`Phone: ${invoiceData.customer.phone}`, 50);
    doc.text(`Email: ${invoiceData.customer.email}`, 50);
    doc.text(invoiceData.customer.address, 50);

    doc.moveDown(1);
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(0.5);

    // Items table header
    const startX = 50;
    const colWidth = 110;
    const row1Y = doc.y;

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('Item', startX, row1Y);
    doc.text('Qty', startX + colWidth * 2.5, row1Y);
    doc.text('Price (Tk)', startX + colWidth * 3.5, row1Y);
    doc.text('Total (Tk)', startX + colWidth * 4.5, row1Y);

    doc
      .moveTo(50, doc.y + 15)
      .lineTo(550, doc.y + 15)
      .stroke();
    doc.moveDown(1);

    // Items
    doc.fontSize(8).font('Helvetica');
    invoiceData.items.forEach((item) => {
      const itemY = doc.y;
      doc.text(item.title.substring(0, 30), startX, itemY, { width: colWidth * 2 });
      doc.text(item.quantity.toString(), startX + colWidth * 2.5, itemY);
      doc.text(item.price.toString(), startX + colWidth * 3.5, itemY);
      doc.text((item.quantity * item.price).toFixed(2), startX + colWidth * 4.5, itemY);
      doc.moveDown(1.5);
    });

    // Totals
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(0.5);

    doc.fontSize(9).font('Helvetica');
    const subtotalY = doc.y;
    doc.text('Subtotal:', startX + colWidth * 3.5, subtotalY);
    doc.text(`Tk ${invoiceData.subtotal.toFixed(2)}`, startX + colWidth * 4.5, subtotalY);

    doc.moveDown(0.5);
    const shippingY = doc.y;
    doc.text('Shipping Charge:', startX + colWidth * 3.5, shippingY);
    doc.text(`Tk ${invoiceData.shippingCharge.toFixed(2)}`, startX + colWidth * 4.5, shippingY);

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(11);
    const totalY = doc.y;
    doc.text('TOTAL:', startX + colWidth * 3.5, totalY);
    doc.text(`Tk ${invoiceData.total.toFixed(2)}`, startX + colWidth * 4.5, totalY);

    // Footer
    doc.moveDown(2);
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
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
export const getPDFStream = (doc: InstanceType<typeof PDFDocument>): Readable => {
  return doc as any;
};
