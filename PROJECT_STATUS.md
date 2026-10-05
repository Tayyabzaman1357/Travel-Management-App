# Project Status — Wanderlust Travel Platform

## Architecture ✅

```
D:\Travel_Management\
├── frontend/   React + Vite + Tailwind SPA (calls http://localhost:5000/api)
└── backend/    Express + MongoDB Atlas REST API (JWT auth, role-based access)
```

Firebase Authentication and Firestore have been **completely removed** — no
Firebase imports, config or dependencies remain in the codebase.

## Backend (complete)

- Express.js REST API on port 5000 with CORS + dotenv
- MongoDB Atlas via Mongoose (9 models: User, Hotel, Flight, Destination, Tour, Booking, Review, Wishlist, Payment)
- JWT authentication (bcryptjs password hashing, token-based sessions)
- Role-based authorization (`user` / `admin`)
- Full CRUD endpoints for all 9 resources
- Multer + Cloudinary image uploads (local `/uploads` fallback without credentials)
- Seed script (`npm run seed`) with demo admin/user accounts and the full catalog
- Env vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, optional Cloudinary keys

## Frontend (complete)

- All Firebase code removed; axios API client points at `http://localhost:5000/api`
- JWT session management (login/register/google/reset, session validation on boot)
- Catalog pages (Hotels, Flights, Tours, Destinations, Home) fetch from the API
- Bookings, reviews, wishlist and payments are API-backed
- Admin dashboard manages users, bookings, reviews and the catalog via the API
- Graceful fallback to the bundled static catalog if the API is unreachable

## Still local (by design — no backend model requested)

- Coupons (admin panel + validation) — localStorage
- Blog posts (admin panel) — localStorage
- Notifications (notification bell) — localStorage
- Static content pages: Cars, Cruises, Insurance, Visa, Offers, Testimonials, FAQ
