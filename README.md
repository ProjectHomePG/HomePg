<div align="center">
  <h1>🏠 Livio (HomePg)</h1>
  <p><strong>A Modern, Scalable Platform for PG & Room Discovery</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Database-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Deployment-Vercel_%7C_Supabase-blueviolet?style=for-the-badge" alt="Deployment" />
  </p>
</div>

---

## 🚀 About Livio

Livio is a production-grade platform for discovering PGs (Paying Guests) and rental rooms. It pairs a lightning-fast **Next.js frontend** with a serverless **Supabase backend** (Postgres, Auth, Storage, Row Level Security) — no separate API server to host, scale, or keep warm.

---

## ✨ Key Features

### 🏡 PG & Property Management
* **Rich Listings:** Detailed PG data including amenities, pricing, availability, and images.
* **Property Administration:** Create, update, and manage PG portfolios with image uploads.
* **Ratings:** Automatic rating aggregation on every review insert/update/delete.

### 🔎 Advanced Discovery & Search
* **Smart Filtering:** Find rooms by budget, location, gender, rating, and amenities.
* **Responsive UI:** Tailwind-styled interface, SSR landing page with streaming.

### 🔐 User & Security Management
* **Supabase Auth:** Email/password authentication with JWT sessions.
* **Role-Based Access Control:** `user`, `owner`, `admin` roles enforced by Postgres RLS.
* **Personalized Profiles:** Favorites, reviews, and owner dashboards per user.

---

## 🏗️ System Architecture

```text
                           ┌─────────────────────────┐
                           │      Web Clients        │
                           └───────────┬─────────────┘
                                       │
                                       ▼
  [ Vercel Edge Network ]   ┌─────────────────────────┐
                            │    Next.js Frontend     │ (React, SSR, Tailwind)
                            │  + Route Middleware      │ (@supabase/ssr session refresh)
                            └───────────┬─────────────┘
                                        │ HTTPS (PostgREST / Auth / Storage)
                                        ▼
  [ Supabase ]              ┌─────────────────────────┐
                            │  Postgres + RLS         │ (profiles, pgs, reviews, ...)
                            │  GoTrue Auth            │ (JWT, roles)
                            │  Storage                │ (public `pg-images` bucket)
                            └─────────────────────────┘
```

Every data access from the browser goes through PostgREST with the publishable key; **Row Level Security policies** in `supabase/migrations/0001_init.sql` are the authorization layer (anon users can browse and submit inquiries, owners manage their own PGs, admins manage everything).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS, Lucide Icons |
| **Backend** | Supabase — Postgres, Auth (GoTrue), Storage, PostgREST |
| **Data Access** | `@supabase/supabase-js` + `@supabase/ssr` (server/client/middleware helpers) |
| **Security** | Postgres Row Level Security, role-based policies |
| **Hosting** | Vercel (frontend), Supabase (database, auth, storage) |
| **Migration** | Node.js scripts (`scripts/supabase/`), SQL schema (`supabase/migrations/`) |

---

## 🚀 Deployment Strategy (Production)

1. **Frontend (Vercel):** The Next.js application deploys on Vercel's Edge Network. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` in the Vercel project env.
2. **Supabase:** Apply `supabase/migrations/0001_init.sql` (schema, RLS, storage bucket, triggers) via the Dashboard SQL Editor or `node scripts/supabase/apply-schema.mjs`.
3. **Middleware:** `src/middleware.js` refreshes the Supabase session on every matched route (official `@supabase/ssr` pattern).
4. **Auth UI:** Authentication flows are wired but hidden — flip `AUTH_ENABLED` in `frontend/src/config.js` to `true` to expose login/signup UI.

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher)

### 1. Configure environment

```bash
cd frontend
cp .env.example .env.local   # fill in Supabase URL + publishable key
```

### 2. Start the Next.js frontend

```bash
cd frontend
npm install
npm run dev
```
> The web interface will be available at `http://localhost:8082`

The app talks directly to Supabase — there is no backend server to run.

---

## 🔐 Environment Variables

`frontend/.env.local` (see `frontend/.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://bestpgnearme.com
```

Repo root `.env.migrate` (gitignored, migration scripts only):

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<db-host>:5432/postgres
```

---

## 🗄️ Database Migration (H2 → Supabase)

One-time scripts that moved the legacy Spring Boot/H2 data into Supabase:

```bash
cd scripts/supabase
npm install

node --env-file=../../.env.migrate apply-schema.mjs    # apply supabase/migrations/0001_init.sql
node --env-file=../../.env.migrate load.mjs            # profiles, pgs, images, reviews, favorites + auth users
node --env-file=../../.env.migrate upload-images.mjs   # 5,347 images -> public `pg-images` bucket (resumable)
node --env-file=../../.env.migrate import-scraper.mjs  # ongoing: import new scraped CSVs (see scraper/README.md)
node --env-file=../../.env.migrate verify.mjs          # live RLS + data checks as an anonymous visitor
```

`export-h2.sh` regenerates the CSVs in `/tmp/h2export/` from a legacy H2 database file if you ever need to re-run `load.mjs`.

---

## 📁 Repository Structure

```text
HomePg/
├── frontend/                 # Next.js React application
│   ├── src/app/              # App Router pages (SSR landing, search, admin, ...)
│   ├── src/components/       # Reusable UI components
│   ├── src/services/         # Supabase data layer (pg/auth/review/inquiry services)
│   ├── src/utils/supabase/   # @supabase/ssr client/server/middleware helpers
│   ├── src/middleware.js     # Session refresh middleware
│   └── .env.example          # Environment template
├── supabase/
│   └── migrations/           # 0001_init.sql — schema, RLS, triggers, storage bucket
├── scripts/supabase/         # Migration tooling (export/load/upload/verify)
└── scraper/                  # Standalone scraping tooling (optional)
```

---

<div align="center">
  <p>Built with ❤️ to make property experiences simpler, smarter, and more accessible.</p>
</div>
