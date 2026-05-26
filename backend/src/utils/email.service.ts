import nodemailer from 'nodemailer';
import { Order } from '../order/order.model';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Alternative SMTP configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD
//   }
// });

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  orderId: string,
  recipientEmail: string,
  recipientName: string
) => {
  try {
    const order = await Order.findById(orderId).populate('items.book');

    if (!order) {
      throw new Error('Order not found');
    }

    // Calculate total
    const subtotal = order.totalPrice;
    const shippingCharge = 40;
    const total = subtotal + shippingCharge;

    // Create HTML email template
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">আপনার অর্ডার নিশ্চিত হয়েছে</h1>
        
        <p>প্রিয় ${recipientName},</p>
        
        <p>আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই এটি পাঠাতে থাকব।</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>অর্ডার বিস্তারিত</h3>
          <p><strong>অর্ডার ID:</strong> ${orderId}</p>
          <p><strong>অর্ডার তারিখ:</strong> ${order.createdAt.toLocaleDateString('bn-BD')}</p>
          <p><strong>স্ট্যাটাস:</strong> প্রক্রিয়াধীন</p>
        </div>
        
        <h3>আইটেমগুলি</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">পণ্য</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">পরিমাণ</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">মূল্য</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">মোট</th>
          </tr>
          ${order.items
            .map(
              (item: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.book.title}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">৳${item.price}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">৳${item.price * item.quantity}</td>
            </tr>
          `
            )
            .join('')}
        </table>
        
        <div style="margin-top: 20px; text-align: right;">
          <p><strong>সাবটোটাল:</strong> ৳${subtotal}</p>
          <p><strong>ডেলিভারি চার্জ:</strong> ৳${shippingCharge}</p>
          <h2 style="color: #d4af37;"><strong>মোট: ৳${total}</strong></h2>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>পরবর্তী পদক্ষেপ</h3>
          <p>১. আমরা আপনার পণ্যগুলি প্যাক করব</p>
          <p>২. আপনার দোরগোড়ায় পাঠানো হবে</p>
          <p>৩. ডেলিভারি হলে আপনি বিজ্ঞপ্তি পাবেন</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          যদি কোন প্রশ্ন থাকে তবে আমাদের সাথে যোগাযোগ করুন: 
          <a href="mailto:support@maktabatus-salaf.com">support@maktabatus-salaf.com</a>
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: +880-XXX-XXX-XXXX | Email: info@maktabatus-salaf.com
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@maktabatus-salaf.com',
      to: recipientEmail,
      subject: `অর্ডার নিশ্চিতকরণ - ${orderId}`,
      html: htmlTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (
  orderId: string,
  recipientEmail: string,
  recipientName: string,
  status: string
) => {
  try {
    const statusBangla: Record<string, string> = {
      pending: 'অপেক্ষমান',
      processing: 'প্রক্রিয়াধীন',
      shipped: 'পাঠানো হয়েছে',
      delivered: 'ডেলিভারি হয়েছে',
      cancelled: 'বাতিল করা হয়েছে'
    };

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">অর্ডার স্ট্যাটাস আপডেট</h1>
        
        <p>প্রিয় ${recipientName},</p>
        
        <p>আপনার অর্ডারের স্ট্যাটাস আপডেট হয়েছে।</p>
        
        <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h2 style="margin: 0; color: #856404;">আপনার অর্ডার এখন: <strong>${statusBangla[status] || status}</strong></h2>
        </div>
        
        <p><strong>অর্ডার ID:</strong> ${orderId}</p>
        
        ${
          status === 'shipped'
            ? '<p>আপনার পণ্য শীঘ্রই আপনার কাছে পৌঁছাবে। ট্র্যাকিং সংখ্যা আপনার ইমেইল এ পাঠানো হবে।</p>'
            : ''
        }
        
        ${
          status === 'delivered'
            ? '<p>আপনার পণ্য সফলভাবে ডেলিভারি হয়েছে। আমরা আশা করছি আপনি পণ্যটি পছন্দ করবেন।</p>'
            : ''
        }
        
        <p style="color: #666; font-size: 12px;">
          আপনার অ্যাকাউন্টে লগইন করে বিস্তারিত দেখুন: 
          <a href="${process.env.FRONTEND_URL}/profile/orders">আমার অর্ডার</a>
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: +880-XXX-XXX-XXXX | Email: info@maktabatus-salaf.com
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@maktabatus-salaf.com',
      to: recipientEmail,
      subject: `অর্ডার স্ট্যাটাস আপডেট - ${statusBangla[status] || status}`,
      html: htmlTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  recipientEmail: string,
  recipientName: string,
  resetToken: string
) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">পাসওয়ার্ড রিসেট অনুরোধ</h1>
        
        <p>প্রিয় ${recipientName},</p>
        
        <p>আপনি আপনার পাসওয়ার্ড রিসেট করার অনুরোধ করেছেন। নিচের লিঙ্কে ক্লিক করুন নতুন পাসওয়ার্ড সেট করতে।</p>
        
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #1a4d2e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            পাসওয়ার্ড রিসেট করুন
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666;">
          অথবা এই লিঙ্ক কপি করুন: <br>
          <code style="background-color: #f0f0f0; padding: 8px; display: block; margin-top: 10px;">
            ${resetLink}
          </code>
        </p>
        
        <p style="color: #d32f2f; font-size: 12px;">
          <strong>নোট:</strong> এই লিঙ্কটি মাত্র ২৪ ঘন্টার জন্য বৈধ।
        </p>
        
        <p style="color: #666; font-size: 12px;">
          যদি আপনি এই অনুরোধ করেননি, তবে এই ইমেইলটি উপেক্ষা করুন।
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: +880-XXX-XXX-XXXX | Email: info@maktabatus-salaf.com
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@maktabatus-salaf.com',
      to: recipientEmail,
      subject: 'পাসওয়ার্ড রিসেট অনুরোধ',
      html: htmlTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send review notification to admin
export const sendReviewNotificationEmail = async (
  adminEmail: string,
  reviewerName: string,
  bookTitle: string,
  rating: number,
  comment: string
) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">নতুন রিভিউ আসেছে</h1>
        
        <p>একজন গ্রাহক নতুন রিভিউ লিখেছেন:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>রিভিউয়ার:</strong> ${reviewerName}</p>
          <p><strong>বই:</strong> ${bookTitle}</p>
          <p><strong>রেটিং:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
          <p><strong>মন্তব্য:</strong> ${comment}</p>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          রিভিউটি অনুমোদন বা প্রত্যাখ্যান করতে অ্যাডমিন প্যানেলে লগইন করুন।
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@maktabatus-salaf.com',
      to: adminEmail,
      subject: `নতুন রিভিউ: ${bookTitle}`,
      html: htmlTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Review notification email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending review notification email:', error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfiguration = async (testEmail: string) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a4d2e;">ইমেইল কনফিগারেশন টেস্ট</h1>
        <p>এটি একটি টেস্ট ইমেইল। যদি এটি পান তবে আপনার ইমেইল কনফিগারেশন সঠিক আছে।</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@maktabatus-salaf.com',
      to: testEmail,
      subject: 'টেস্ট ইমেইল',
      html: htmlTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};
