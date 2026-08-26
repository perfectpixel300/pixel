# Pixel Perfect — Artisan Stationery & Administrative Studio

A minimalist, high-performance web platform built with the **MERN** stack (MongoDB, Express, React 19, Node.js + Vite) for **Pixel Perfect**, an artisan stationery atelier.

Designed with an **editorial, high-contrast Black & White monochrome aesthetic** with zero blue/purple tints.

---

## 🏛️ Architecture & Folder Structure

```
pixel-mern/
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── seedData.js               # Sample products & hero banners
│   ├── controllers/
│   │   ├── auth.controller.js        # Admin auth & JWT issuance
│   │   ├── product.controller.js     # Product CRUD, filters, search & toggle
│   │   ├── banner.controller.js      # Banner CRUD, reorder & live toggle
│   │   ├── contact.controller.js     # Customer inquiries submission & triage
│   │   └── dashboard.controller.js   # Aggregated metrics & stats
│   ├── middleware/
│   │   └── auth.middleware.js        # JWT protection for admin routes
│   ├── models/
│   │   ├── user.model.js             # Admin User model (bcryptjs hashed)
│   │   ├── product.model.js          # Product catalog model with specs
│   │   ├── banner.model.js           # Home hero banners model
│   │   └── contact.model.js          # Inquiries and correspondence model
│   ├── routes/
│   │   ├── auth.routes.js            # /api/auth endpoints
│   │   ├── product.routes.js         # /api/products endpoints
│   │   ├── banner.routes.js          # /api/banners endpoints
│   │   ├── contact.routes.js         # /api/contact endpoints
│   │   ├── dashboard.routes.js       # /api/dashboard/stats endpoint
│   │   └── seed.routes.js            # /api/seed endpoint
│   ├── utils/
│   │   └── generateToken.js          # JWT sign utility
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminSidebar.jsx
    │   │   │   ├── AdminHeader.jsx
    │   │   │   ├── DashboardOverview.jsx
    │   │   │   ├── ProductManagement.jsx
    │   │   │   ├── ProductFormModal.jsx
    │   │   │   ├── BannerManagement.jsx
    │   │   │   ├── BannerFormModal.jsx
    │   │   │   └── InquiriesManagement.jsx
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Toast.jsx
    │   │   │   └── DeleteConfirmModal.jsx
    │   │   └── storefront/
    │   │       ├── HeroBannerCarousel.jsx
    │   │       ├── FeaturedSection.jsx
    │   │       ├── CategoryGrid.jsx
    │   │       ├── ProductCard.jsx
    │   │       └── InquiryModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── data/
    │   │   └── mockData.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── AboutPage.jsx
    │   │   ├── ContactPage.jsx
    │   │   ├── AdminLoginPage.jsx
    │   │   └── AdminDashboardPage.jsx
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── auth.service.js
    │   ├── index.css
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

---

## 🌟 Key Pages & Features

### 1. 🏠 Home Page (`/`)
- **Dynamic Hero Banner Carousel**: Reads active banners directly from the MongoDB database with custom typography, CTA links, and slide indicators.
- **Atelier Philosophy**: Editorial mission statement.
- **Curated Highlights**: Featured objects with quick inquiry options.
- **Disciplines Grid**: Category cards for Notebooks, Pens & Writing, Desk Accessories, Fine Paper, Art Supplies, and Leather Goods.
- **Provenance & Materials**: Spotlight on Swedish Munken paper, CNC machined solid brass, and Tuscan leather.

### 2. 📦 Products Page & Detail View (`/products`)
- Complete catalog with category tabs, search bar, stock filter, and sorting.
- **Product Detail View**: Multi-image thumbnail gallery, indicative price, in-stock status, material specifications table (GSM, Binding, Color, Dimensions, Provenance), and direct **"Inquire About This Piece"** button.

### 3. 📜 About Page (`/about`)
- Atelier origins, craftsmanship ethos, sustainable small-batch production, and the Four Core Tenets.

### 4. ✉️ Contact Page (`/contact`)
- Direct correspondence form that saves messages and order inquiries to the database.
- Atelier studio locations, visiting hours, bespoke corporate gifting information, and FAQ accordion.

### 5. 🔒 Protected Admin Studio (`/admin`)
- **Authentication Gateway (`/admin/login`)**: Protected route using JWT authentication with bcryptjs password verification.
  - **Default Credentials**: `admin@pixelperfect.com` / `admin123`
- **Dashboard Overview**: Summary counters, catalog valuation, live hero banners, and category ratio charts.
- **Product Management**: Create, edit, delete products, toggle availability, toggle featured, edit specs, and pick image presets.
- **Banner Management**: Create, edit, delete, reorder home hero banners, live simulator with desktop/mobile viewport toggle.
- **Client Inquiries**: Review and triage messages sent through the contact form and product inquiry modals.

---

## 🚀 Running Locally

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
