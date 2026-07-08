# VendorMart — Multi-Vendor E-Commerce Platform

A full-stack multi-vendor marketplace built with the MERN stack. Multiple vendors can list products, customers can shop across vendors in a single checkout, and admins manage the platform.

🔗 **Live Demo:** https://ecommerce-platform-murex.vercel.app/
🔗 **API:** https://vendormart-api.onrender.com

## Features

### Customer

- Browse products with search, filter by category, sort by price
- Product detail page with image gallery and reviews
- Add to cart, update quantity, remove items
- Multi-step checkout with address and mock payment
- Order tracking with real-time status updates
- Order confirmation email

### Vendor

- Shop setup and management
- Product CRUD with Cloudinary image upload
- Order management with status updates
- Revenue and order analytics dashboard

### Admin

- Vendor approval system
- Platform-wide vendor management
- Real-time statistics

---

## Tech Stack

**Frontend:**

- React + Vite
- React Router DOM
- Axios with interceptors
- React Hot Toast
- CSS Variables (Dark/Light theme)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication + bcrypt
- Multer + Cloudinary (image uploads)
- Nodemailer (email notifications)
- Socket.io (real-time features)

**Deployment:**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Images: Cloudinary

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository
   \```bash
   git clone https://github.com/zeel2384/ecommerce-platform.git
   cd ecommerce-platform
   \```

2. Install backend dependencies
   \```bash
   cd server
   npm install
   \```

3. Create `.env` file in server folder
   \```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_ADDRESS=your_gmail
   EMAIL_APP_PASSWORD=your_app_password
   CLIENT_URL=http://localhost:5173
   \```

4. Install frontend dependencies
   \```bash
   cd ../client
   npm install
   \```

5. Create `.env` file in client folder
   \```env
   VITE_API_URL=http://localhost:5000/api
   \```

6. Run the project
   \```bash

# Terminal 1 — Backend

cd server
npm run dev

# Terminal 2 — Frontend

cd client
npm run dev
\```

---

## Project Structure

\```
ecommerce-platform/
├── client/ # React frontend
│ └── src/
│ ├── api/ # Axios instance + API calls
│ ├── components/ # Reusable components
│ ├── context/ # Auth, Cart, Theme context
│ └── pages/ # All pages
└── server/ # Node.js backend
└── src/
├── config/ # DB + Cloudinary config
├── controllers/ # Business logic
├── middleware/ # Auth middleware
├── models/ # Mongoose schemas
└── routes/ # API routes
\```

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user

### Products

- `GET /api/products` — Get all products (search, filter, sort, paginate)
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create product (vendor)
- `PUT /api/products/:id` — Update product (vendor)
- `DELETE /api/products/:id` — Delete product (vendor)
- `POST /api/products/:id/reviews` — Add review (customer)

### Orders

- `POST /api/orders` — Create order (customer)
- `GET /api/orders/my-orders` — Get customer orders
- `GET /api/orders/vendor-orders` — Get vendor orders
- `PUT /api/orders/:id/status` — Update order status (vendor)

### Vendor

- `POST /api/vendor/setup` — Setup vendor shop
- `GET /api/vendor/profile` — Get vendor profile
- `PUT /api/vendor/profile` — Update vendor profile
- `GET /api/vendor/all` — Get all vendors (admin)
- `PUT /api/vendor/:id/approve` — Approve vendor (admin)

---

## Screenshots

_(Add screenshots after deployment)_

---

## Author

**Zeel Patel**

- GitHub: [@zeel2384](https://github.com/zeel2384)
- LinkedIn: [Add your LinkedIn URL]

---

## License

MIT License
