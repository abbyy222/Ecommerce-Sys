# 🛍️ E-Commerce Platform with Delivery Management

> **⚠️ PROJECT STATUS: IN ACTIVE DEVELOPMENT**
> 
> This project is currently under active development and is **NOT YET PRODUCTION-READY**. Many features are still being implemented and tested. Use at your own risk in production environments.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Development Status](#development-status)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## 🌟 Overview

A modern, full-stack e-commerce platform with integrated delivery management system. This application provides a complete solution for online retail with real-time order tracking, rider management, and customer-facing shopping experience.

---

## ✨ Features

### ✅ Completed Features

#### **Admin Dashboard**
- 📦 **Product Management**
  - Add, edit, delete products
  - Multiple image upload support
  - Stock management
  - Category filtering
  - Search functionality
  - Product statistics dashboard

- 📋 **Order Management**
  - View all orders with filters
  - Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
  - Update order status
  - View detailed order information
  - Search orders by ID, customer name, or email
  - Order statistics and analytics

- 🚴 **Rider Management**
  - Add, edit, delete delivery riders
  - Assign riders to orders
  - Set delivery dates
  - Track rider availability
  - View rider statistics (deliveries, completion rate)
  - Manage rider active/inactive status

#### **Customer Interface**
- 🛒 **Shopping Experience**
  - Browse products by category
  - Real-time search
  - Product details view
  - Add to cart functionality
  - Stock availability indicators
  - Responsive design for all devices

#### **Backend API**
- 🔐 **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, Customer, Rider)
  - Cookie-based session management

- 📊 **Inventory Management**
  - Stock tracking
  - Inventory movement logs
  - Automatic stock updates on orders
  - Low stock alerts

---

## 🚧 Development Status

### ⏳ In Progress / Pending Features

#### **Customer Side**
- [ ] Checkout page with order summary
- [ ] Order confirmation page
- [ ] Customer order history
- [ ] Live order tracking with GPS
- [ ] Customer profile management
- [ ] Wishlist functionality
- [ ] Product reviews and ratings

#### **Admin Side**
- [ ] Revenue analytics dashboard
- [ ] Sales reports and charts
- [x] Customer management
- [ ] Bulk product import/export
- [ ] Email notifications for orders
- [x] Advanced filtering and sorting

#### **Rider Side**
- [ ] Rider dashboard
- [ ] Accept/reject order assignments
- [ ] Mark order as "Ready to Dispatch"
- [ ] Start delivery with GPS tracking
- [ ] Update delivery location in real-time
- [ ] Upload proof of delivery
- [ ] Delivery history

#### **Payment Integration**
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Multiple payment methods
- [ ] Payment confirmation
- [ ] Refund processing



---

## 🛠️ Tech Stack

### **Frontend**
- **React** 18.x - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cookie Parser** - Cookie management

### **File Storage**
- **Multer** - File upload middleware
- **Cloudinary** (planned) - Image hosting

---

## 📁 Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   │   ├── AdminProductsManagement.jsx
│   │   │   │   ├── AdminViewOrders.jsx
│   │   │   │   └── AdminManageRiders.jsx
│   │   │   └── customer/      # Customer-facing pages
│   │   │       └── ECommerceHome.jsx
│   │   ├── services/          # API service files
│   │   │   ├── api.js         # Axios configuration
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── cartService.js
│   │   │   └── riderService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── models/                # Mongoose schemas
│   │   ├── product.js
│   │   ├── ordermodel.js
│   │   ├── cartmodel.js
│   │   ├── inventoryMovement.js
│   │   └── user.js
│   ├── controllers/           # Route controllers
│   │   ├── orderController.js
│   │   └── (other controllers)
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── config/                # Configuration files
│   └── server.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
touch .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run on:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---



## 🎨 Design Philosophy

### Color Scheme
- **Dark Theme**: Deep slate and indigo backgrounds (900 shades)
- **Accent Colors**: Cyan, Purple, Pink, Emerald gradients
- **Professional**: No white backgrounds, mature color palette
- **Readable**: High contrast text (white/gray on dark)

### Performance
- Minimal animations to prevent lag
- Only card hover effects and entrance animations
- Optimized image loading
- Efficient API calls

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (1 col), Tablet (2 col), Desktop (4 col)
- Touch-friendly buttons and inputs
- Scrollable tables on mobile

---

## 🗺️ Roadmap

### Phase 1: Core E-Commerce ✅ (Current)
- [x] Product management
- [x] Order management
- [x] Rider management
- [x] Shopping cart
- [x] Checkout process

### Phase 2: Customer Experience (In Progress)
- [x] Complete checkout flow
- [x] Order confirmation
- [x] Customer dashboard
- [x] Order history
- [x] Product reviews

### Phase 3: Delivery System (Pending)
- [ ] Rider dashboard
- [ ] GPS tracking
- [ ] Live location updates
- [ ] Proof of delivery
- [ ] Delivery notifications

### Phase 4: Payment Integration (Pending)
- [ ] Paystack integration
- [ ] Payment confirmation
- [ ] Invoice generation
- [ ] Refund system


---

## ⚠️ Known Issues

- ⚠️ **Authentication**: User authentication is implemented but may need refinement
- ⚠️ **File Upload**: Image upload works locally but needs production CDN setup
- ⚠️ **Payment**: No payment gateway integrated yet
- ⚠️ **Email**: Email notifications not yet implemented
- ⚠️ **GPS Tracking**: Live tracking endpoints exist but frontend not yet built
- ⚠️ **Testing**: No automated tests written yet

---

## 🤝 Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

### Development Guidelines
1. Follow the existing code structure
2. Use the established service pattern for API calls
3. Maintain dark theme with gradient colors
4. Keep animations minimal
5. Ensure mobile responsiveness
6. Update this README when adding features

---

## 📄 License

This project is currently unlicensed. License will be added upon completion.

---

## 👥 Team

**Status**: Solo development project (in progress)

---

## 📞 Contact

For questions or collaboration, please create an issue in the repository.

---

## 🙏 Acknowledgments

- **Lucide Icons** - Beautiful icon library
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Flexible NoSQL database
- **Express.js** - Minimalist web framework

---

**Last Updated**: November 2024

**Version**: 0.1.0 (Alpha - In Development)

---

> **Remember**: This project is NOT production-ready. Many features are still being implemented and tested. Use in development environments only until officially released.
