# ✈️ Wanderlust — Travel Booking Platform (Full-Stack)

A full-stack travel booking platform built with a completely separated architecture:

```
travel-booking/
├── frontend/   # React + Vite + Tailwind CSS (SPA)
└── backend/    # Node.js + Express + MongoDB Atlas (REST API)
```

The frontend and backend are **fully independent projects** with their own `package.json`,
`node_modules` and environment files. They communicate over HTTP — the frontend calls
`http://localhost:5000/api` (no Firebase anywhere).

---

## 🗂️ Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18 · Vite 5 · Tailwind CSS 3 · React Router 6 · Framer Motion · Axios · React Hook Form · Swiper · Leaflet |
| Backend   | Node.js · Express · MongoDB Atlas (Mongoose) · JWT · bcryptjs · Multer · Cloudinary · dotenv · CORS |

## 🚀 Getting Started

### 1. Backend (`backend/`)

```bash
cd backend
cp .env.example .env        # then fill in MONGODB_URI, JWT_SECRET (+ optional Cloudinary keys)
npm install
npm run seed                # seeds demo users + the full catalog into MongoDB Atlas
npm run dev                 # starts the API on http://localhost:5000
```

Required environment variables (`backend/.env`):

```
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random string>
CLIENT_URL=http://localhost:5173
```

Demo accounts (created by the seed):

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@wanderlust.com   | admin123   |
| User  | user@wanderlust.com    | user123    |

### 2. Frontend (`frontend/`)

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api (default)
npm install
npm run dev                # starts the SPA on http://localhost:5173
```

> Run both servers in two terminals. The SPA reads all catalog data (hotels,
> flights, tours, destinations), auth, bookings, reviews, wishlist and payments
> from the API. If the API is unreachable, catalog pages gracefully fall back to
> the bundled static data so the UI never breaks.

## 📡 API Overview (`http://localhost:5000/api`)

Full CRUD for every resource, with JWT role-based auth (`user` / `admin`).

| Resource      | Public reads | Auth (user)                          | Auth (admin)                    |
|---------------|--------------|--------------------------------------|---------------------------------|
| `/auth`       | register, login, google, forgot/reset password | `me`, `update-profile` | — |
| `/users`      | —            | —                                    | list, get, update, delete       |
| `/hotels`     | list, get    | —                                    | create, update, delete          |
| `/flights`    | list, get    | —                                    | create, update, delete          |
| `/tours`      | list, get    | —                                    | create, update, delete          |
| `/destinations` | list, get  | —                                    | create, update, delete          |
| `/bookings`   | —            | create, `my`, get/update/delete own  | list all, update, delete        |
| `/reviews`    | list         | create, `my`, update/delete own      | update/delete any               |
| `/wishlist`   | —            | list, add, remove                    | —                               |
| `/payments`   | —            | checkout (creates booking + payment), `my` | list all, update, delete  |
| `/upload`     | —            | upload image(s) → Cloudinary (local fallback) | — |

Response shape is consistent: `{ success, data | message, ... }`. Auth endpoints return `{ token, user }`.

## 🛠️ Development Notes

- **Seeding:** `npm run seed` in `backend/` only inserts when a collection is empty.
- **Uploads:** with `CLOUDINARY_*` set, images go to Cloudinary; otherwise they are saved to `backend/uploads/` and served at `/uploads/...`.
- **Coupons & Blog** remain local to the browser (no backend model was requested for them) — manageable from the admin panel.
- **Google sign-in** is simulated by the backend (issues a JWT for a generated Google-style account) — no Firebase, no OAuth round trip.
