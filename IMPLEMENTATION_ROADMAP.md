# 🛣️ Implementation Roadmap - Maktabatus Salaf

**Timeline**: 4-5 weeks for complete MVP  
**Start Date**: May 26, 2026

---

## 📅 WEEK 1: Backend Payment & Cart System

### Phase 1.1: Cart Management API (2 hours)
**Deliverable**: Fully functional cart endpoints

```bash
# Create new module
mkdir -p backend/src/modules/cart

# Files needed:
- cart.model.ts
- cart.controller.ts
- cart.service.ts
- cart.validation.ts
- cart.routes.ts
```

**Endpoints to Create:**
```javascript
POST   /api/cart              // Add item
GET    /api/cart              // Get cart (require auth)
PUT    /api/cart/:id          // Update quantity
DELETE /api/cart/:id          // Remove item
DELETE /api/cart              // Clear cart (require auth)
```

**Database Model:**
```typescript
interface ICart {
  user: ObjectId,
  items: [{
    book: ObjectId,
    quantity: number,
    price: number
  }],
  totalPrice: number,
  createdAt: Date,
  updatedAt: Date
}
```

**Validation Rules:**
```javascript
- Quantity: min 1, max 100
- Price: must match book price (anti-fraud)
- Stock validation: check if book has enough stock
```

**Key Features:**
- Add with quantity
- Prevent duplicate entries (increment quantity instead)
- Auto-calculate total price
- Validate stock before adding
- Clear cart after successful order

---

### Phase 1.2: Payment Gateway Integration (6 hours)
**Deliverable**: Working payment system with SSLCommerz

#### Step 1: SSLCommerz Account Setup
```
1. Go to https://www.sslcommerce.com/
2. Register merchant account
3. Get store ID and API password
4. Get SANDBOX credentials for testing
5. Add webhook URL
```

#### Step 2: Backend Payment Module
```bash
# Create payment module
mkdir -p backend/src/modules/payment

# Files:
- payment.model.ts
- payment.controller.ts
- payment.service.ts
- payment.routes.ts
```

**Endpoints:**
```javascript
POST   /api/payment/initiate        // Initialize payment
POST   /api/payment/verify          // Verify payment from gateway
GET    /api/payment/status/:id      // Check payment status
POST   /api/payment/webhook         // Webhook from gateway
```

#### Step 3: Implementation Code

**payment.model.ts:**
```typescript
interface IPayment {
  order: ObjectId,
  user: ObjectId,
  amount: number,
  currency: string,
  transactionId: string,
  paymentMethod: string,
  status: "pending" | "completed" | "failed",
  failureReason?: string,
  createdAt: Date,
  updatedAt: Date
}
```

**payment.controller.ts (initiate):**
```typescript
export const initiatePaymentHandler = async (req, res) => {
  const { orderId, amount } = req.body;
  
  // Validate order exists
  const order = await Order.findById(orderId);
  
  // Call SSLCommerz API
  const sslcz = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false // sandbox mode
  );
  
  const paymentPayload = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: `${orderId}-${Date.now()}`,
    product_name: 'Maktabatus Salaf Books',
    product_category: 'Books',
    cus_name: order.customer.name,
    cus_email: order.customer.email,
    cus_phone: order.customer.phone,
    success_url: `${process.env.BASE_URL}/api/payment/success`,
    fail_url: `${process.env.BASE_URL}/api/payment/fail`,
    cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
    ipn_url: `${process.env.BASE_URL}/api/payment/webhook`
  };
  
  // Get redirect URL
  const response = await sslcz.init(paymentPayload);
  
  // Save payment record
  const payment = new Payment({
    order: orderId,
    user: req.user._id,
    amount,
    status: 'pending',
    transactionId: paymentPayload.tran_id
  });
  await payment.save();
  
  sendResponse(res, 200, 'Payment initiated', { 
    redirectUrl: response.redirectUrl 
  });
};
```

**payment.service.ts (verify):**
```typescript
export const verifyPayment = async (transactionId: string) => {
  const sslcz = new SSLCommerzPayment(...);
  
  const verification = await sslcz.validate({
    tran_id: transactionId
  });
  
  if (verification.status === 'VALID') {
    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { status: 'completed' },
      { new: true }
    );
    
    // Update order status
    await Order.findByIdAndUpdate(
      payment.order,
      { status: 'processing', paymentStatus: 'paid' }
    );
    
    return payment;
  }
  
  throw new Error('Payment verification failed');
};
```

#### Step 4: Security Measures
```typescript
// Verify amount hasn't been changed
if (receivedAmount !== expectedAmount) {
  throw new Error('Amount mismatch');
}

// Verify transaction ID format
if (!transactionId.startsWith(orderId)) {
  throw new Error('Invalid transaction');
}

// Check duplicate payment
const existingPayment = await Payment.findOne({ transactionId });
if (existingPayment) {
  throw new Error('Duplicate payment');
}
```

**Required Packages:**
```bash
npm install ssl-commerse  # or appropriate SDK
npm install axios         # for API calls
npm install dotenv        # for credentials
```

**Environment Variables:**
```
STORE_ID=your_store_id
STORE_PASSWORD=your_password
PAYMENT_BASE_URL=http://localhost:5000
PAYMENT_GATEWAY=sslcommerce
```

---

### Phase 1.3: Invoice Generation (3 hours)
**Deliverable**: PDF invoice download

**Files:**
```bash
mkdir -p backend/src/modules/invoice
- invoice.service.ts
- invoice.routes.ts
```

**Implementation:**
```bash
npm install pdfkit
# or
npm install puppeteer
```

**invoice.service.ts:**
```typescript
import PDFDocument from 'pdfkit';

export const generateInvoice = async (orderId: string) => {
  const order = await Order.findById(orderId)
    .populate('items.book')
    .populate('user');
  
  const doc = new PDFDocument();
  
  // Header
  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.fontSize(10).text('Maktabatus Salaf', { align: 'center' });
  
  // Invoice details
  doc.text(`Invoice ID: ${order._id}`);
  doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
  
  // Customer details
  doc.text('Bill To:');
  doc.text(order.user.name);
  doc.text(order.user.phone);
  doc.text(order.shippingAddress);
  
  // Items table
  doc.text('Items:');
  doc.text('─'.repeat(50));
  
  order.items.forEach(item => {
    doc.text(
      `${item.book.title} x${item.quantity} = ${item.price * item.quantity}`
    );
  });
  
  doc.text('─'.repeat(50));
  doc.text(`Subtotal: ৳${order.totalPrice}`);
  doc.text(`Shipping: ৳40`);
  doc.text(`TOTAL: ৳${order.totalPrice + 40}`);
  
  return doc;
};
```

**invoice.routes.ts:**
```typescript
router.get('/download/:orderId', protect, async (req, res) => {
  const doc = await generateInvoice(req.params.orderId);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="invoice-${req.params.orderId}.pdf"`
  );
  
  doc.pipe(res);
  doc.end();
});
```

---

### Phase 1.4: Email Notifications (3 hours)
**Deliverable**: Automated email system

**Setup:**
```bash
npm install nodemailer
npm install dotenv
```

**email.service.ts:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOrderConfirmation = async (order: IOrder) => {
  // Generate invoice PDF
  const invoicePath = await generateInvoicePDF(order);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `অর্ডার নিশ্চিতকরণ - ${order._id}`,
    html: `
      <h1>আপনার অর্ডার নিশ্চিত হয়েছে</h1>
      <p>অর্ডার ID: ${order._id}</p>
      <p>মোট দাম: ৳${order.totalPrice}</p>
      <p>আমরা শীঘ্রই আপনার অর্ডার ডেলিভারি শুরু করব।</p>
    `,
    attachments: [
      { filename: 'invoice.pdf', path: invoicePath }
    ]
  };
  
  return transporter.sendMail(mailOptions);
};

export const sendOrderStatusUpdate = async (order: IOrder) => {
  const transporter = getTransporter();
  
  const statusBangla = {
    pending: 'অপেক্ষমান',
    processing: 'প্রক্রিয়াধীন',
    shipped: 'পাঠানো হয়েছে',
    delivered: 'ডেলিভারি হয়েছে'
  };
  
  await transporter.sendMail({
    to: order.customer.email,
    subject: `অর্ডার স্ট্যাটাস আপডেট`,
    html: `<p>আপনার অর্ডার এখন ${statusBangla[order.status]}</p>`
  });
};
```

---

## 📅 WEEK 2-3: Frontend Core Pages

### Phase 2.1: Next.js Setup (2 hours)

```bash
# Create Next.js project
npx create-next-app@latest maktabatus-salaf --typescript

# Install dependencies
npm install framer-motion three next-three tailwindcss
npm install axios zustand react-icons
npm install firebase
npm install react-quill (for blog editor)
```

**Project Structure:**
```
frontend/
├── app/
│   ├── page.tsx                 # Home
│   ├── books/
│   │   ├── [slug]/page.tsx     # Book details
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── books/page.tsx
│   │   ├── orders/page.tsx
├── components/
│   ├── shared/
│   ├── home/
│   ├── product/
│   ├── cart/
│   ├── admin/
├── lib/
│   ├── api.ts
│   ├── store.ts (Zustand)
├── styles/globals.css
```

---

### Phase 2.2: Home Page (6 hours)

**Key Components:**
```typescript
// app/page.tsx
import HeroBanner from '@/components/home/HeroBanner';
import SearchFilter from '@/components/home/SearchFilter';
import PopularBooks from '@/components/home/PopularBooks';
import NewBooks from '@/components/home/NewBooks';
import BlogSection from '@/components/home/BlogSection';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <main>
      <HeroBanner />        {/* Three.js animated */}
      <SearchFilter />      {/* Left sidebar */}
      <PopularBooks />
      <NewBooks />
      <BlogSection />
      <Footer />
    </main>
  );
}
```

**HeroBanner Component (Three.js):**
```typescript
'use client';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-96"
    >
      <Canvas>
        {/* Islamic geometric pattern animation */}
        <IslamicPattern />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold">মাক্তাবাতুস সালাফ</h1>
      </div>
    </motion.section>
  );
}
```

**SearchFilter Component:**
```typescript
// components/home/SearchFilter.tsx
'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function SearchFilter() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    minPrice: 0,
    maxPrice: 5000,
    sort: 'newest'
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Call API with search query
      api.get('/books', { params: { search: query, ...filters } });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-20 w-64 h-screen bg-white shadow-lg p-4"
    >
      {/* Search */}
      <input
        type="text"
        placeholder="বই খুঁজুন..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Category Filter */}
      {/* Author Filter */}
      {/* Price Range Slider */}
      {/* Sort Dropdown */}
    </motion.aside>
  );
}
```

---

### Phase 2.3: Book Details Page (5 hours)

```typescript
// app/books/[slug]/page.tsx
import { api } from '@/lib/api';
import BookGallery from '@/components/product/BookGallery';
import ReviewSection from '@/components/product/ReviewSection';
import RelatedBooks from '@/components/product/RelatedBooks';

export default async function BookDetailsPage({ params }) {
  const book = await api.get(`/books/${params.slug}`);
  const reviews = await api.get(`/reviews/book/${book._id}`);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Image */}
        <BookGallery images={book.coverImage} />

        {/* Book Info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600">{book.author.name}</p>
          <p className="text-2xl font-bold text-gold mt-4">৳{book.price}</p>

          {/* Buy & Add to Cart Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-gold text-white py-2 rounded">
              এখনই কিনুন
            </button>
            <button className="flex-1 border border-gold py-2 rounded">
              কার্টে যোগ করুন
            </button>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">বিবরণ</h2>
            <p>{book.description}</p>
          </div>

          {/* Share Buttons */}
          <ShareButtons url={`/books/${book.slug}`} />
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection bookId={book._id} reviews={reviews} />

      {/* Related Books */}
      <RelatedBooks categoryId={book.category._id} />
    </main>
  );
}
```

---

### Phase 2.4: Cart Page (4 hours)

```typescript
// app/cart/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">কার্ট</h1>

      {cart.length === 0 ? (
        <p>আপনার কার্ট খালি</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="border p-4 rounded flex justify-between">
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p>৳{item.price}</p>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value))
                    }
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-600"
                  >
                    সরান
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between mb-4">
              <span>মোট:</span>
              <span className="font-bold">৳{total}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-gold text-white py-3 rounded">
                চেকআউটে যান
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
```

---

### Phase 2.5: Checkout Page (5 hours)

```typescript
// app/checkout/page.tsx
'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const [isGuest, setIsGuest] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    thana: '',
    district: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create order
    const order = await api.post('/orders', {
      items: cart,
      customer: formData,
      shippingCharge: 40
    });

    // Redirect to payment
    window.location.href = order.paymentUrl;
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">চেকআউট</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest vs Returning User */}
        <div>
          <label>
            <input
              type="radio"
              checked={isGuest}
              onChange={() => setIsGuest(true)}
            />
            অতিথি হিসেবে চেকআউট করুন
          </label>
        </div>

        {/* Form Fields */}
        <input
          placeholder="নাম"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="ফোন"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {/* More fields */}

        {/* Price Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span>পণ্যের দাম:</span>
            <span>৳{total}</span>
          </div>
          <div className="flex justify-between">
            <span>ডেলিভারি চার্জ:</span>
            <span>৳40</span>
          </div>
          <div className="flex justify-between font-bold mt-4 text-lg">
            <span>মোট:</span>
            <span>৳{total + 40}</span>
          </div>
        </div>

        <button className="w-full bg-gold text-white py-3 rounded">
          পেমেন্ট এগিয়ে যান
        </button>
      </form>
    </main>
  );
}
```

---

## 📅 WEEK 3-4: User & Admin Features

### Phase 3.1: Authentication Pages (4 hours)

**Login Page Setup (Firebase OTP)**

```typescript
// app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password })
      });
      
      const data = await response.json();
      
      // Save token
      localStorage.setItem('token', data.token);
      // Redirect to dashboard
      window.location.href = '/profile';
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">লগইন</h1>
        
        <input
          placeholder="ফোন নম্বর"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="password"
          placeholder="পাসওয়ার্ড"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <button disabled={loading} className="w-full bg-gold text-white py-2 rounded">
          {loading ? 'লোড হচ্ছে...' : 'লগইন'}
        </button>
      </form>
    </main>
  );
}
```

---

### Phase 3.2: Customer Profile Pages (6 hours)

```typescript
// app/profile/page.tsx
'use client';
export default function ProfilePage() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar Navigation */}
        <nav className="col-span-1 border rounded p-4">
          <ul className="space-y-2">
            <li><Link href="/profile">প্রোফাইল</Link></li>
            <li><Link href="/profile/orders">অর্ডার</Link></li>
            <li><Link href="/profile/wishlist">উইশলিস্ট</Link></li>
            <li><Link href="/profile/reviews">রিভিউ</Link></li>
            <li><Link href="/profile/settings">সেটিংস</Link></li>
          </ul>
        </nav>

        {/* Content Area */}
        <div className="col-span-3">
          {/* Profile edit form */}
        </div>
      </div>
    </main>
  );
}
```

---

### Phase 3.3: Admin Panel (10 hours)

```typescript
// app/admin/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(setStats);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">ড্যাশবোর্ড</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="মোট বিক্রয়" value={`৳${stats?.totalSales}`} />
        <StatCard title="অর্ডার" value={stats?.totalOrders} />
        <StatCard title="বই" value={stats?.totalBooks} />
        <StatCard title="ইউজার" value={stats?.totalUsers} />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-2 gap-8">
        <ChartComponent />
        <RecentOrdersTable />
      </div>
    </main>
  );
}
```

---

## 📋 Week-by-Week Breakdown

```
WEEK 1:
  Day 1-2: Cart API + Testing
  Day 3-4: Payment gateway integration
  Day 5: Invoice + Email setup

WEEK 2:
  Day 1: Next.js setup
  Day 2-3: Home page
  Day 4-5: Book details page

WEEK 3:
  Day 1-2: Cart page
  Day 3-4: Checkout page
  Day 5: Testing & fixes

WEEK 4:
  Day 1-2: Auth pages
  Day 3-4: Customer profile
  Day 5: Bug fixes

WEEK 5 (if needed):
  Day 1-5: Admin panel
  + Animations + Testing + Deployment
```

---

## ⚠️ Critical Reminders

1. **Payment Gateway First** - Don't skip this, it's critical
2. **Test locally** - Use SANDBOX mode before production
3. **Security** - Validate all payments on backend
4. **Email Setup** - Get SMTP credentials ready
5. **Firebase** - Setup phone auth before starting register page

---

## 🎯 Success Criteria

✅ All 4 payment API endpoints working  
✅ Invoice generation working  
✅ Email notifications sending  
✅ All 7 frontend pages built  
✅ Cart fully functional  
✅ Checkout complete  
✅ Admin panel operational  
✅ 95% responsive design  

---

**Status**: Ready for implementation  
**Complexity**: High  
**Team Size**: 2-3 developers recommended
