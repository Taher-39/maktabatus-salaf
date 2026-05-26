# 🧪 Postman Testing Setup - Maktabatus Salaf Backend

এই ডিরেক্টরিতে সম্পূর্ণ Backend API টেস্টিং এর জন্য সব প্রয়োজনীয় ফাইল রয়েছে।

---

## 📁 ফাইলের বর্ণনা

### 1. **Postman_Collection_Testing.json**
সমস্ত API endpoints সহ সম্পূর্ণ Postman collection।

**অন্তর্ভুক্ত API Modules:**
- 🔐 Authentication (লগইন/রেজিস্ট্রেশন)
- 📚 Category Management (ক্যাটাগরি)
- ✍️ Author Management (লেখক)
- 🏢 Publisher Management (প্রকাশনী)
- 📖 Book Management (বই)
- ⭐ Review Management (রিভিউ)
- 📝 Blog Management (ব্লগ)
- 🎨 Banner Management (ব্যানার)
- 💝 Wishlist Management (উইশলিস্ট)
- 🛒 Order Management (অর্ডার)
- 👤 User Management (ইউজার)

**ব্যবহার:**
1. Postman খুলুন
2. File → Import
3. `Postman_Collection_Testing.json` নির্বাচন করুন
4. Collections এ সব endpoints দেখা যাবে

---

### 2. **Postman_Environment.json**
সমস্ত variables এবং environment setup।

**অন্তর্ভুক্ত Variables:**
- `base_url`: API এর base URL (http://localhost:5000)
- `admin_token`: Admin এর JWT token
- `user_token`: Regular user এর JWT token
- সব IDs (category, author, publisher, book, review, blog, banner, order)

**ব্যবহার:**
1. Postman এ Environment management খুলুন
2. Import → `Postman_Environment.json`
3. Testing এর সময় এই environment সিলেক্ট করুন
4. Response পেলে IDs dynamic ভাবে variables এ save করুন

---

### 3. **TESTING_GUIDE.md**
বিস্তারিত step-by-step testing গাইড।

**এতে আছে:**
- ✅ পূর্বশর্তাবলী (Prerequisites)
- ✅ সঠিক পরীক্ষার ক্রম
- ✅ প্রতিটি API এর request/response উদাহরণ
- ✅ সাধারণ সমস্যা এবং সমাধান
- ✅ পূর্ণ Testing Checklist

**পড়ার উপায়:**
```bash
# Terminal এ খুলতে পারেন
cat TESTING_GUIDE.md
```

---

### 4. **Sample_Data_For_Testing.json**
সব testing data প্রস্তুত - শুধু copy-paste করুন।

**অন্তর্ভুক্ত Data:**
```json
{
  "adminUser": { ... },
  "regularUser": { ... },
  "categories": [ ... ],
  "authors": [ ... ],
  "publishers": [ ... ],
  "books": [ ... ],
  "reviews": [ ... ],
  "blogPosts": [ ... ],
  "banners": [ ... ],
  "orders": [ ... ]
}
```

**ব্যবহার:**
প্রতিটি API call এ এই ফাইল থেকে data নিয়ে পেস্ট করুন।

---

## 🚀 শুরু করার পদক্ষেপ

### Step 1: Backend সার্ভার চালু করুন
```bash
cd backend
npm install    # প্রথমবার
npm run dev    # সার্ভার চালু করতে
```

**আউটপুট দেখা যাবে:**
```
Server running on port 5000
Database connected
```

### Step 2: Postman Collection Import করুন
```
Postman খুলুন
  ↓
File → Import
  ↓
Postman_Collection_Testing.json সিলেক্ট করুন
```

### Step 3: Environment সেট করুন
```
Environments → Import
  ↓
Postman_Environment.json সিলেক্ট করুন
  ↓
এই environment সিলেক্ট করুন (ড্রপডাউন থেকে)
```

### Step 4: Testing শুরু করুন
```
TESTING_GUIDE.md অনুযায়ী step by step চলুন
```

---

## 📊 Testing Order (সঠিক ক্রম)

```
1️⃣  Authentication
    ↓
2️⃣  Category Management
    ↓
3️⃣  Author Management
    ↓
4️⃣  Publisher Management
    ↓
5️⃣  Book Management
    ↓
6️⃣  Review Management
    ↓
7️⃣  Blog Management
    ↓
8️⃣  Banner Management
    ↓
9️⃣  Wishlist Management
    ↓
🔟 Order Management
    ↓
👤 User Management
```

**কেন এই ক্রম?**
- প্রথমে আপনার authentication token দরকার
- তারপর Master data (Categories, Authors, Publishers)
- তারপর Books
- তারপর Features (Reviews, Blog, etc.)
- তারপর User operations (Wishlist, Order)

---

## 🔑 গুরুত্বপূর্ণ টিপস

### ✅ Do's
✓ প্রতিটি response থেকে ID নিয়ে environment variables update করুন  
✓ সব required fields দিয়ে request পাঠান  
✓ Authorization header সর্বদা দিন  
✓ JSON format সঠিক রাখুন  

### ❌ Don'ts
✗ চেইন ভাঙ্গা অবস্থায় test করবেন না  
✗ Random ID দিয়ে test করবেন না  
✗ Authorization ছাড়া protected route access করবেন না  
✗ Response body পরিবর্তন করবেন না  

---

## 🐛 সাধারণ সমস্যা এবং সমাধান

### সমস্যা: "Cannot GET /api/category"
```
সমাধান: Backend সার্ভার চালু আছে কিনা চেক করুন
npm run dev
```

### সমস্যা: "401 Unauthorized"
```
সমাধান: Authorization header check করুন
Headers → Authorization → Bearer {{admin_token}}
```

### সমস্যা: "400 Bad Request"
```
সমাধান: Request body এর JSON check করুন
- Comma সঠিক আছে কিনা
- Quotes মিলছে কিনা
- Required fields আছে কিনা
```

### সমস্যা: "500 Internal Server Error"
```
সমাধান: Backend console দেখুন error message এর জন্য
```

---

## 📈 Postman Pre-request Scripts

Authorization token automatically সেট করার জন্য, প্রতিটি collection folder এ এই script যোগ করুন:

```javascript
// Login API এর After Response এ:
pm.environment.set("admin_token", pm.response.json().token);
```

---

## ✨ একটি সম্পূর্ণ Testing Session এর উদাহরণ

```bash
1. Backend চালু করুন: npm run dev

2. Postman খুলুন এবং:
   - Collection: Postman_Collection_Testing.json import করুন
   - Environment: Postman_Environment.json import করুন
   - Environment সিলেক্ট করুন

3. Testing শুরু করুন:
   
   ✓ Authentication → Register Admin
   ✓ Copy token → {{admin_token}} এ পেস্ট করুন
   ✓ Authentication → Login Admin
   ✓ Copy token again (নিশ্চিত করার জন্য)
   
   ✓ Category → Create Category - Quran
   ✓ Copy category_id → {{category_quran}} এ পেস্ট করুন
   
   ✓ Author → Create Author 1
   ✓ Copy author_id → {{author_id_1}} এ পেস্ট করুন
   
   ... এবং সব গুলি API এভাবে test করুন

4. সব API test শেষ → সবগুলি ✅ চেক হবে
```

---

## 📚 API Reference Quick Links

| API | Method | Endpoint |
|-----|--------|----------|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Get Categories | GET | `/api/category` |
| Create Category | POST | `/api/category` |
| Get Books | GET | `/api/book` |
| Create Book | POST | `/api/book` |
| Get Reviews | GET | `/api/review` |
| Create Review | POST | `/api/review` |
| Get Blogs | GET | `/api/blog` |
| Create Blog | POST | `/api/blog` |
| Get Banners | GET | `/api/banner` |
| Create Banner | POST | `/api/banner` |
| Get Wishlist | GET | `/api/wishlist` |
| Add Wishlist | POST | `/api/wishlist/add` |
| Get Orders | GET | `/api/order` |
| Create Order | POST | `/api/order` |

---

## 🎓 শেখার সংস্থান

### নতুন Postman ইউজারদের জন্য:
- [Postman Learning Center](https://learning.postman.com/)
- Postman এ নিজেই অনেক tutorials আছে

### API টেস্টিং best practices:
- Always test happy path first
- Then test edge cases
- Then test error scenarios

---

## 💬 সাহায্যের জন্য

যদি কোনো সমস্যা হয়:

1. **TESTING_GUIDE.md** সম্পূর্ণ পড়ুন
2. **Sample_Data_For_Testing.json** data check করুন
3. **Backend console** error message দেখুন
4. Variables সঠিকভাবে সেট আছে কিনা চেক করুন

---

## 🎉 সফল Testing এর পরে

সব API test হয়ে গেলে:
- Postman collection এবং environment export করুন (backup এর জন্য)
- Test results screenshot নিন (documentation এর জন্য)
- Features ready আছে frontend development শুরু করতে পারেন!

---

**Happy Testing! 🚀**
