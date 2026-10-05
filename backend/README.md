# 🛠️ Travel Booking API

Node.js + Express + MongoDB Atlas (Mongoose) REST API with JWT authentication and
role-based access (admin / user).

## Setup

```bash
cp .env.example .env   # set MONGODB_URI + JWT_SECRET
npm install
npm run seed           # optional: demo users + catalog
npm run dev            # http://localhost:5000
```

## Structure

```
backend/
├── server.js            # entry point (CORS, JSON, static /uploads, routes)
├── config/              # db.js (MongoDB), cloudinary.js (uploads)
├── models/              # User, Hotel, Flight, Destination, Tour, Booking, Review, Wishlist, Payment
├── controllers/         # auth, users, hotels, flights, tours, destinations, bookings, reviews, wishlist, payments, upload
├── routes/              # one router per resource + index.js aggregator
├── middleware/          # auth.js (protect/authorize), error.js, upload.js (Multer)
└── utils/               # asyncHandler, ApiError, generateToken, seed.js + seedData.js
```

## Authentication

- `POST /api/auth/register`, `POST /api/auth/login` → `{ token, user }`
- Send `Authorization: Bearer <token>` on protected routes.
- `GET /api/auth/me` returns the current user; `PUT /api/auth/update-profile` updates name/phone/address/photoURL.
- `POST /api/auth/google` is a simulated Google sign-in (returns a JWT for a generated Google-style account).
- Admin-only endpoints require a user with `role: 'admin'`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | no | Default `5000` |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | JWT signing secret |
| `JWT_EXPIRES_IN` | no | Default `7d` |
| `CLIENT_URL` | yes | Allowed CORS origin (frontend dev server) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | no | Cloudinary uploads; local fallback when absent |
