# 🧪 Postman API Testing Guide - Maktabatus Salaf

## ভূমিকা
এই গাইডটি সমস্ত API গুলি পরীক্ষা করার জন্য ধাপে ধাপে নির্দেশনা প্রদান করে।

---

## ✅ পূর্বশর্তাবলী

1. **Postman ডাউনলোড করুন**: https://www.postman.com/downloads/
2. **Backend সার্ভার চালু করুন**: `npm run dev` (পোর্ট: 5000)
3. **Postman Collection Import করুন**: 
   - File → Import
   - `Postman_Collection_Testing.json` নির্বাচন করুন

---

## 📌 পরীক্ষার ক্রম (Test Sequence)

### Step 1️⃣: Authentication (অথেন্টিকেশন)

#### 1.1 Admin User রেজিস্ট্রেশন
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@maktabatus-salaf.com",
  "password": "Admin@1234",
  "phone": "01712345678",
  "address": "Dhaka, Bangladesh"
}
```

**আশা করা Response (201):**
```json
{
  "statusCode": 201,
  "message": "সফল",
  "data": {
    "_id": "user_id_here",
    "name": "Admin User",
    "email": "admin@maktabatus-salaf.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### 1.2 Admin Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "admin@maktabatus-salaf.com",
  "password": "Admin@1234"
}
```

**আশা করা Response (200):**
```json
{
  "statusCode": 200,
  "message": "সফল",
  "data": {
    "_id": "user_id_here",
    "name": "Admin User",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

💡 **গুরুত্বপূর্ণ**: Token কপি করে Postman Variables এ `admin_token` সেট করুন:
```
Authorization → Bearer Token → {{admin_token}}
```

---

### Step 2️⃣: Category Setup (ক্যাটাগরি সেটআপ)

সমস্ত ৪টি ক্যাটাগরি তৈরি করুন:

#### 2.1 Create Category - Quran (কুরআন)
```
POST /api/category
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "name": "কুরআন",
  "description": "কুরআন মাজিদ এবং তাফসীর সংক্রান্ত বই",
  "image": "https://via.placeholder.com/300?text=Quran"
}
```

#### 2.2 Create Category - Hadith (হাদিস)
```json
{
  "name": "হাদিস",
  "description": "হাদিস শরিফ এবং হাদিস বিজ্ঞান বিষয়ক বই",
  "image": "https://via.placeholder.com/300?text=Hadith"
}
```

#### 2.3 Create Category - Aqidah (আকিদা)
```json
{
  "name": "আকিদা",
  "description": "ইসলামিক আকিদা এবং বিশ্বাস বিষয়ক বই",
  "image": "https://via.placeholder.com/300?text=Aqidah"
}
```

#### 2.4 Create Category - Islamic Law (ফিকহ)
```json
{
  "name": "ফিকহ/আইন",
  "description": "ইসলামিক আইন এবং শরিয়া সংক্রান্ত বই",
  "image": "https://via.placeholder.com/300?text=Islamic_Law"
}
```

#### 2.5 Get All Categories
```
GET /api/category
```

💾 **সব ক্যাটাগরির ID সংরক্ষণ করুন!**

---

### Step 3️⃣: Author Setup (লেখক সেটআপ)

3 জন লেখক তৈরি করুন:

#### 3.1 Create Author 1
```
POST /api/author
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "name": "ডক্টর আব্দুল্লাহ আল-মামুন",
  "bio": "প্রখ্যাত ইসলামিক স্কলার এবং লেখক",
  "email": "author1@example.com"
}
```

#### 3.2 Create Author 2
```json
{
  "name": "মাওলানা আবুল কালাম আজাদ",
  "bio": "বিশিষ্ট হাদিস বিশারদ এবং শিক্ষাবিদ",
  "email": "author2@example.com"
}
```

#### 3.3 Create Author 3
```json
{
  "name": "শেইখ আল-আলবানি",
  "bio": "হাদিস গবেষণাবিদ এবং ইসলামিক পণ্ডিত",
  "email": "author3@example.com"
}
```

💾 **সব লেখকের ID সংরক্ষণ করুন!**

---

### Step 4️⃣: Publisher Setup (প্রকাশনী সেটআপ)

#### 4.1 Create Publisher 1
```
POST /api/publisher
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "name": "Maktabatus Salaf",
  "description": "ইসলামিক বইয়ের প্রধান প্রকাশনী",
  "email": "info@maktabatus-salaf.com"
}
```

#### 4.2 Create Publisher 2
```json
{
  "name": "Islamic Foundation",
  "description": "আন্তর্জাতিক ইসলামিক প্রকাশনী",
  "email": "info@islamicfoundation.org"
}
```

💾 **প্রকাশনীর ID সংরক্ষণ করুন!**

---

### Step 5️⃣: Book Creation (বই তৈরি)

প্রতিটি ক্যাটাগরিতে বই তৈরি করুন:

#### 5.1 Book 1 - Sahih Al-Bukhari (Hadith Category)
```
POST /api/book
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "title": "সহিহ আল-বুখারি",
  "description": "ইসলামের সবচেয়ে বিশ্বাসযোগ্য হাদিস সংগ্রহ। ইমাম মুহাম্মদ ইসমাইল আল-বুখারি রচিত এই সংগ্রহে রয়েছে ৭২৬৫টি হাদিস।",
  "author": "{{author_id_1}}",
  "category": "{{category_hadith}}",
  "publisher": "{{publisher_id_1}}",
  "price": 850,
  "stock": 50
}
```

#### 5.2 Book 2 - Al-Quran Al-Karim (Quran Category)
```json
{
  "title": "আল-কুরআন আল-করিম",
  "description": "আল্লাহর চূড়ান্ত বার্তা যা মুহাম্মদ (সাঃ) এর মাধ্যমে আমাদের কাছে পৌঁছেছে। বাংলা অনুবাদ এবং তাফসীর সহ।",
  "author": "{{author_id_2}}",
  "category": "{{category_quran}}",
  "publisher": "{{publisher_id_1}}",
  "price": 1500,
  "stock": 100
}
```

#### 5.3 Book 3 - At-Tawheed (Aqidah Category)
```json
{
  "title": "আত-তাওহিদ",
  "description": "ইসলামিক আকিদার মৌলিক ভিত্তি। এটি সর্বশক্তিমান আল্লাহর একত্ব এবং তার গুণাবলী নিয়ে আলোচনা করে।",
  "author": "{{author_id_3}}",
  "category": "{{category_aqidah}}",
  "publisher": "{{publisher_id_2}}",
  "price": 650,
  "stock": 75
}
```

#### 5.4 Book 4 - Hidayah (Islamic Law Category)
```json
{
  "title": "হিদায়াহ",
  "description": "ইসলামিক আইন এবং ফিকহ শাস্ত্রের সবচেয়ে গুরুত্বপূর্ণ গ্রন্থ। আলুসি রচিত এই কাজ ইসলামি আইনশাস্ত্রের ভিত্তি।",
  "author": "{{author_id_1}}",
  "category": "{{category_law}}",
  "publisher": "{{publisher_id_1}}",
  "price": 1200,
  "stock": 40
}
```

#### 5.5 Get All Books
```
GET /api/book?page=1&limit=12
```

💾 **সব বইয়ের ID সংরক্ষণ করুন!**

---

### Step 6️⃣: Review Testing (রিভিউ পরীক্ষা)

#### 6.1 নতুন ইউজার তৈরি (রিভিউ দেওয়ার জন্য)
```
POST /api/auth/register
```
```json
{
  "name": "Ahmed Ali",
  "email": "user1@example.com",
  "password": "User@1234",
  "phone": "01787654321",
  "address": "Dhaka"
}
```

💡 **Token কপি করে `user_token` হিসেবে সংরক্ষণ করুন!**

#### 6.2 Create Review
```
POST /api/review
Headers: Authorization: Bearer {{user_token}}
```
```json
{
  "book": "{{book_id}}",
  "rating": 5,
  "title": "অসাধারণ ইসলামিক জ্ঞান",
  "comment": "এই বইটি আমার ইসলামিক জ্ঞান বৃদ্ধিতে অত্যন্ত সাহায্য করেছে। লেখক অত্যন্ত দক্ষ এবং জ্ঞানী ব্যক্তি। সবার জন্য অত্যন্ত সুপারিশকৃত।"
}
```

#### 6.3 Get Book Reviews
```
GET /api/review/book/{{book_id}}?page=1&limit=5
```

#### 6.4 Mark Review as Helpful
```
PATCH /api/review/{{review_id}}/helpful
```

#### 6.5 Update Review
```
PUT /api/review/{{review_id}}
Headers: Authorization: Bearer {{user_token}}
```
```json
{
  "rating": 4,
  "title": "খুবই ভাল বই",
  "comment": "এটি একটি চমৎকার বই যা সবার পড়া উচিত।"
}
```

---

### Step 7️⃣: Blog Testing (ব্লগ পরীক্ষা)

#### 7.1 Create Blog Post
```
POST /api/blog
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "title": "ইসলামে শিক্ষার গুরুত্ব",
  "excerpt": "ইসলামে শিক্ষা অর্জন একটি ধর্মীয় দায়িত্ব এবং প্রতিটি মুসলিমের জন্য অপরিহার্য।",
  "content": "# ইসলামে শিক্ষার গুরুত্ব\n\nইসলাম শিক্ষাকে অত্যন্ত গুরুত্ব দেয়।\n\n## শিক্ষার ফলাফল\n\n১. মানসিক উন্নয়ন\n২. সামাজিক উন্নতি\n৩. নৈতিক উন্নয়ন",
  "category": "শিক্ষা"
}
```

#### 7.2 Get Published Blogs
```
GET /api/blog?status=published&page=1&limit=10
```

#### 7.3 Like Blog Post
```
PATCH /api/blog/{{blog_id}}/like
```

#### 7.4 Increment Blog Views
```
PATCH /api/blog/{{blog_id}}/views
```

---

### Step 8️⃣: Banner Testing (ব্যানার পরীক্ষা)

#### 8.1 Create Hero Banner
```
POST /api/banner
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "title": "ঈদ মেগা অফার",
  "description": "সকল বইয়ে পর্যন্ত ৫০% ছাড়",
  "link": "/books?category=all",
  "position": "hero",
  "startDate": "2026-05-26T00:00:00Z",
  "endDate": "2026-06-30T23:59:59Z"
}
```

#### 8.2 Get Active Banners
```
GET /api/banner/active?position=hero
```

#### 8.3 Get All Banners
```
GET /api/banner?status=active&page=1&limit=10
```

---

### Step 9️⃣: Wishlist Testing (উইশলিস্ট পরীক্ষা)

#### 9.1 Add Book to Wishlist
```
POST /api/wishlist/add
Headers: Authorization: Bearer {{user_token}}
```
```json
{
  "bookId": "{{book_id}}"
}
```

#### 9.2 Get My Wishlist
```
GET /api/wishlist?page=1&limit=20
Headers: Authorization: Bearer {{user_token}}
```

#### 9.3 Check if Book in Wishlist
```
GET /api/wishlist/check/{{book_id}}
Headers: Authorization: Bearer {{user_token}}
```

#### 9.4 Remove from Wishlist
```
POST /api/wishlist/remove
Headers: Authorization: Bearer {{user_token}}
```
```json
{
  "bookId": "{{book_id}}"
}
```

---

### Step 🔟: Order Testing (অর্ডার পরীক্ষা)

#### 10.1 Create Order
```
POST /api/order
Headers: Authorization: Bearer {{user_token}}
```
```json
{
  "items": [
    {
      "book": "{{book_id}}",
      "quantity": 2,
      "price": 850
    },
    {
      "book": "{{book_id_2}}",
      "quantity": 1,
      "price": 1500
    }
  ],
  "shippingAddress": "ঢাকা, বাংলাদেশ",
  "phone": "01712345678"
}
```

#### 10.2 Get My Orders
```
GET /api/order?page=1&limit=10
Headers: Authorization: Bearer {{user_token}}
```

#### 10.3 Get Order Details
```
GET /api/order/{{order_id}}
Headers: Authorization: Bearer {{user_token}}
```

#### 10.4 Cancel Order
```
PATCH /api/order/{{order_id}}/cancel
Headers: Authorization: Bearer {{user_token}}
```

#### 10.5 Get All Orders (Admin)
```
GET /api/order/admin?status=pending&page=1&limit=20
Headers: Authorization: Bearer {{admin_token}}
```

#### 10.6 Update Order Status (Admin)
```
PATCH /api/order/{{order_id}}/status
Headers: Authorization: Bearer {{admin_token}}
```
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

---

## 📊 Testing Checklist

### ✅ Authentication
- [ ] Admin Register
- [ ] Admin Login
- [ ] Regular User Register
- [ ] Regular User Login

### ✅ Categories
- [ ] Create Quran Category
- [ ] Create Hadith Category
- [ ] Create Aqidah Category
- [ ] Create Islamic Law Category
- [ ] Get All Categories

### ✅ Authors
- [ ] Create 3 Authors
- [ ] Get All Authors

### ✅ Publishers
- [ ] Create 2 Publishers
- [ ] Get All Publishers

### ✅ Books
- [ ] Create 4 Books (1 per category)
- [ ] Get All Books
- [ ] Get Popular Books
- [ ] Get Book by Slug

### ✅ Reviews
- [ ] Create Review
- [ ] Get All Reviews
- [ ] Get Book Reviews
- [ ] Mark as Helpful
- [ ] Update Review
- [ ] Delete Review

### ✅ Blog
- [ ] Create Blog Post
- [ ] Get All Blogs
- [ ] Get Blog by Slug
- [ ] Like Blog
- [ ] Increment Views
- [ ] Update Blog
- [ ] Delete Blog

### ✅ Banner
- [ ] Create Hero Banner
- [ ] Create Featured Banner
- [ ] Get Active Banners
- [ ] Get All Banners
- [ ] Update Banner
- [ ] Delete Banner

### ✅ Wishlist
- [ ] Add to Wishlist
- [ ] Get Wishlist
- [ ] Check if in Wishlist
- [ ] Remove from Wishlist
- [ ] Clear Wishlist

### ✅ Orders
- [ ] Create Order
- [ ] Get My Orders
- [ ] Get Order Details
- [ ] Cancel Order
- [ ] Get All Orders (Admin)
- [ ] Update Order Status (Admin)

---

## 🐛 সাধারণ সমস্যা এবং সমাধান

### সমস্যা: "401 Unauthorized"
**সমাধান**: Token সঠিকভাবে সেট আছে কিনা চেক করুন।
```
Authorization Header: Bearer {{admin_token}}
```

### সমস্যা: "404 Not Found"
**সমাধান**: ID সঠিক কিনা নিশ্চিত করুন। Response থেকে কপি করুন।

### সমস্যা: "400 Bad Request"
**সমাধান**: Request body এর format চেক করুন। সব required field আছে কিনা দেখুন।

---

## 📝 নোট
- সমস্ত timestamps ISO 8601 format এ থাকতে হবে
- সব price সংখ্যা হতে হবে (string নয়)
- Authorization header সর্বদা Bearer token দিয়ে শুরু হতে হবে

---

**Happy Testing! 🎉**
