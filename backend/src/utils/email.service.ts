import nodemailer from 'nodemailer';
import { Order } from "../modules/order/order.model";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'taherpust@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'nzsr ncfq qcyb uxzt'
  }
});

// Send contact form email
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
      <hr style="border: 1px solid #e5e7eb;">

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>

      <h3 style="color: #3b82f6; margin-top: 20px;">Message:</h3>
      <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
        ${message}
      </p>

      <hr style="border: 1px solid #e5e7eb; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 12px;">
        This email was sent from your portfolio contact form.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'taherpust@gmail.com',
    to: 'taherpust@gmail.com',
    subject: `Portfolio Contact: ${subject}`,
    html: htmlTemplate,
  };

  return transporter.sendMail(mailOptions);
};

//
export const sendOtpEmail = async (email: string, name: string, otp: string) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
        <h2 style="color: #047857; text-align: center;">অ্যাকাউন্ট ভেরিফিকেশন</h2>
        <p>প্রিয় ${name},</p>
        <p>আপনার অ্যাকাউন্ট তৈরি করার জন্য নিচে দেওয়া ৬ ডিজিটের ওটিপি (OTP) কোডটি ব্যবহার করুন। কোডটির মেয়াদ মাত্র ৫ মিনিট।</p>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827; margin: 20px 0; border-radius: 6px;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 12px; text-align: center;">যদি আপনি এই রিকোয়েস্ট না করে থাকেন, তবে দয়া করে এই মেইলটি ইগনোর করুন।</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: 01407-021847 | Email: maktabatussalaf47@gmail.com
          ডাংগীপাড়া, পবা, রাজশাহী , Rajshahi, Bangladesh, 6203
          FB Page: https://www.facebook.com/MaktabatusSalaf
        </p>
      </div>
    `
    const mailOptions = {
      from: process.env.EMAIL_USER || 'taherpust@gmail.com',
      to: email,
      subject: 'আপনার অ্যাকাউন্ট ভেরিফিকেশন ওটিপি (OTP)',
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

// Send password reset email
export const sendPasswordResetEmail = async (
  recipientEmail: string,
  recipientName: string,
  otp: string
) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 25px; border-radius: 8px;">
        <h1 style="color: #1a4d2e; text-align: center;">পাসওয়ার্ড রিসেট অনুরোধ</h1>
        
        <p>প্রিয় <strong>${recipientName}</strong>,</p>
        
        <p>আপনি আপনার পাসওয়ার্ড রিসেট করার অনুরোধ করেছেন। নিচে আপনার ৬ ডিজিটের গোপন ওটিপি (OTP) কোডটি দেওয়া হলো। কোডটির মেয়াদ মাত্র ৫ মিনিট।</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #1a4d2e; margin: 25px 0; border-radius: 6px; border: 1px dashed #1a4d2e;">
          ${otp}
        </div>
        
        <p style="color: #666; font-size: 12px;">
          যদি আপনি এই অনুরোধ করেননি, তবে এই ইমেইলটি উপেক্ষা করুন। আপনার পাসওয়ার্ড সুরক্ষিত থাকবে।
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
          <strong>মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর</strong><br>
          Call: 01407-021847 | Email: maktabatussalaf47@gmail.com<br>
          ডাংগীপাড়া, পবা, রাজশাহী , Rajshahi, Bangladesh, 6203<br>
          FB Page: <a href="https://www.facebook.com/MaktabatusSalaf" style="color: #1a4d2e;">facebook.com/MaktabatusSalaf</a>
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'taherpust@gmail.com',
      to: recipientEmail,
      subject: 'পাসওয়ার্ড রিসেট অনুরোধ — মাক্তাবাতুস সালাফ',
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
    const subtotal = order.grandTotal;
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
          <a href="mailto:maktabatussalaf47@gmail.com">maktabatussalaf47@gmail.com</a>
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: 01407-021847 | Email: maktabatussalaf47@gmail.com
          ডাংগীপাড়া, পবা, রাজশাহী , Rajshahi, Bangladesh, 6203
          FB Page: https://www.facebook.com/MaktabatusSalaf
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'taherpust@gmail.com',
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
          <a href="${process.env.CLIENT_URL}/profile/orders">আমার অর্ডার</a>
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          মাক্তাবাতুস সালাফ - অনলাইন বুক স্টোর<br>
          Call: 01407-021847 | Email: maktabatussalaf47@gmail.com
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'taherpust@gmail.com',
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



