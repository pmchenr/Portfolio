# Travel Blog — Full‑Stack App (React + Node + MongoDB)

A ready‑to‑run travel blog with an admin area for creating posts, uploading photos, and organizing by destination.

- **Frontend:** React + Vite + Tailwind (in `/frontend`)
- **Backend:** Node + Express + MongoDB + JWT (in `/backend`)
- **Uploads:** Cloudinary (optional for local; recommended for production)

---

## Prerequisites
- **Node.js** 20+ (use `nvm` if possible)
- **Git** (to clone the repo)
- **MongoDB Atlas** connection string (free tier)
- **Cloudinary** account (for image uploads; optional for local testing)

> If you don’t want to set up Cloudinary yet, you can still run locally — just avoid using the image upload in the admin until you add the Cloudinary keys.

---

## Quick Start (Local)

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and set:
# MONGODB_URI=your_atlas_uri_here
# JWT_SECRET=your_long_random_secret
# (Optional) CLOUDINARY_CLOUD_NAME=...
# (Optional) CLOUDINARY_API_KEY=...
# (Optional) CLOUDINARY_API_SECRET=...

npm run seed   # creates default admin user: admin / admin
npm run dev    # starts on http://localhost:5000