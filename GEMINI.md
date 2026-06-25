# Maktabatus Salaf Book Store

A full-stack e-commerce platform for buying and selling Islamic books. Built with modern web technologies for a seamless shopping experience.

🌐 **Live Site:** [maktabatus-salaf.vercel.app](https://maktabatus-salaf.vercel.app)

🔗 **Repository:** [GitHub - Maktabatus Salaf](https://github.com/Taher-39/maktabatus-salaf)

---

## Features

🛍️ **User Features**
- User authentication (login/signup)
- Book browsing and search
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- Review and rating system
- Blog section
- Email verification
- Invoice generation

⚙️ **Admin Features**
- Admin dashboard with overview
- Author management (CRUD)
- Publisher management
- Category management
- Book management
- Order management
- User management

✨ **Additional Features**
- WhatsApp integration button
- Google Firebase integration
- Cloudinary image storage
- PDF invoice generation
- Email notifications
- Dark mode support

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Animation:** Framer Motion
- **HTTP Client:** Axios
- **Authentication:** Firebase
- **Icons:** React Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **Security:** Helmet, CORS, bcryptjs
- **PDF Generation:** PDFMake

---

## Project Structure

```
maktabatus-salaf/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── books/          # Book browsing pages
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   ├── orders/         # Order pages
│   │   │   └── profile/        # User profile
│   │   ├── components/          # React components
│   │   │   ├── admin/          # Admin components
│   │   │   ├── home/           # Home page components
│   │   │   ├── product/        # Product components
│   │   │   └── shared/         # Shared components
│   │   ├── lib/                # Utilities and APIs
│   │   └── globals.css         # Global styles
│   ├── package.json
│   └── tsconfig.json
├── backend/                     # Express backend server
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── author/         # Author management
│   │   │   ├── banner/         # Banner management
│   │   │   ├── blog/           # Blog posts
│   │   │   ├── book/           # Book inventory
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── category/       # Categories
│   │   │   ├── invoice/        # Invoice generation
│   │   │   ├── order/          # Order processing
│   │   │   ├── publisher/      # Publisher management
│   │   │   ├── review/         # Reviews & ratings
│   │   │   ├── user/           # User management
│   │   │   └── wishlist/       # Wishlist functionality
│   │   ├── config/             # Configuration files
│   │   ├── middlewares/        # Express middlewares
│   │   ├── utils/              # Utility functions
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── Resources/                   # Images and static assets
│   └── imgs/
│       ├── authors/
│       └── books/
├── package.json                 # Root package.json
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Cloudinary account
- Firebase project
- Environment variables configured

### Clone the Repository

```bash
git clone https://github.com/Taher-39/maktabatus-salaf.git
cd maktabatus-salaf
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with required environment variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
NODEMAILER_EMAIL=your_email
NODEMAILER_PASSWORD=your_email_password
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

### Root Level
```bash
npm run dev:backend         # Start backend development server
npm run dev:frontend        # Start frontend development server
npm run build:frontend      # Build frontend for production
```

### Backend
```bash
npm run dev         # Start with nodemon
npm run build       # Build TypeScript to JavaScript
npm run start       # Start production server
npm run seed        # Seed database with initial data
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

---

## Key Modules

### Backend Modules
- **Auth** - User authentication and JWT token management
- **Authors** - Manage book authors
- **Categories** - Manage book categories
- **Publishers** - Manage publishers
- **Books** - Manage book inventory
- **Users** - User management and profile handling
- **Orders** - Order processing and management
- **Carts** - Shopping cart management
- **Reviews** - Product reviews and ratings
- **Wishlists** - User wishlists
- **Blog** - Blog posts and content
- **Banners** - Homepage banner management
- **Invoices** - Invoice generation and management

### Frontend Components & Pages

#### Admin Dashboard
- **DashboardLayout** - Role-based sidebar navigation with responsive design
  - Admin: Overview, Users, Authors, Categories, Books, Orders
  - User: Overview, Profile, Orders, Settings
- **Admin Overview** - Stats cards for Books, Authors, Users, Orders
- **Authors Management** - Full CRUD with search, pagination, and dark mode
- **Enhanced Profile Page** - Editable user information with address fields

#### Pages
- **Admin Dashboard** - Central admin panel
- **Author Management** - Create/edit/delete authors
- **Publisher Management** - Publisher administration
- **Category Management** - Category management
- **Book Management** - Book CRUD operations
- **User Home** - Main shopping interface
- **Blog** - Blog reading and browsing

---

## API Documentation

### Key Endpoints

#### Authors
- `GET /api/v1/authors` - Get all authors
- `POST /api/v1/authors` - Create author
- `PUT /api/v1/authors/:id` - Update author
- `DELETE /api/v1/authors/:id` - Delete author

#### Users
- `GET /api/users` - Get all users (admin)
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/me` - Get current user details

#### Books
- `GET /api/v1/books` - Get all books
- `POST /api/v1/books` - Create book
- `PUT /api/v1/books/:id` - Update book
- `DELETE /api/v1/books/:id` - Delete book

#### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order details

Detailed API endpoints and documentation available at backend repository.

---

## Recent Updates

### Dashboard Implementation ✅
- Added responsive DashboardLayout component with role-based navigation
- Implemented Admin Overview page with statistics
- Created full-featured Authors management page with CRUD operations
- Implemented Admin User Management
- Enhanced Profile page with editable user information
- Integrated dark mode support across dashboard components

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Contact & Support

For support and inquiries:
- 📧 Email: [Your Email]
- 🐙 GitHub: [@Taher-39](https://github.com/Taher-39)
- 🌐 Live Site: [maktabatus-salaf.vercel.app](https://maktabatus-salaf.vercel.app)

---

## Changelog

### Latest Updates
- Setup backend modules (authors, categories, publishers, books)
- Admin dashboard with management pages
- Shopping cart and order system
- User authentication and email verification
- Review and rating system
- Blog functionality
- WhatsApp integration
- Dashboard implementation with role-based access
- Enhanced profile page with address fields
- Dark mode support throughout the application

---

**Built with 💙 by Taher-39**
