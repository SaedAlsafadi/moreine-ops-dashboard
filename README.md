# Moreine Ops Dashboard

Internal operations dashboard for Moreine Coffee Roastery. Built with Next.js 14 (App Router), Supabase (Postgres + Auth), and Tailwind CSS.

---

## Features

- **Green Inventory** — Track green coffee lots: origin, supplier, weight, cost
- **Roasting** — Log roast batches with auto-calculated yield %, auto-deduct green stock
- **Roasted Inventory** — Manage bulk and packed stock across bar / B2C / B2B channels
- **Sales Log** — Manual entries + Salla/Rewaa import support with channel filtering
- **Stock Movements** — Auto-generated audit ledger for every inventory action
- **Dashboard** — KPI cards, low-stock alerts, yield trend chart, activity feed
- **Bilingual** — English (LTR) + Arabic (RTL) with cookie-based toggle

---

## 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values from the [Supabase Dashboard → Settings → API](https://app.supabase.com/project/_/settings/api).

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # Never expose client-side

# Low-stock alert thresholds (optional, these are the defaults)
NEXT_PUBLIC_LOW_STOCK_GREEN_KG=60
NEXT_PUBLIC_LOW_STOCK_ROASTED_KG=5
```

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` must NEVER be prefixed with `NEXT_PUBLIC_`. It bypasses Row Level Security and is only for server-side admin operations.

---

## 2. Running the Supabase Migration

### Option A: Supabase Dashboard (Easiest)

1. Open your project in [app.supabase.com](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Paste and run the contents of `supabase/migrations/001_schema.sql`
4. Paste and run the contents of `supabase/rls.sql`

### Option B: Supabase CLI

```bash
# Install the CLI (if not installed)
npm install -g supabase

# Log in and link your project
supabase login
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

### Load Demo Seed Data (Optional)

```sql
-- In SQL Editor, run:
\i supabase/seed.sql
```

Or paste the file contents directly. **Remove seed data before going to production.**

### Add a User

Users are created manually — there is no public sign-up page.

1. In the Supabase Dashboard → **Authentication → Users**
2. Click **Invite user** or **Create user**
3. Set email + password

---

## 3. Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

---

## 4. Deploying to Vercel (Free Tier)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Moreine Ops Dashboard"
git push origin main
```

### Step 2: Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select your repo
3. Framework preset: **Next.js** (auto-detected)

### Step 3: Set Environment Variables

In the Vercel project settings, add all four variables from your `.env.local`:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `NEXT_PUBLIC_LOW_STOCK_GREEN_KG` | `60` |
| `NEXT_PUBLIC_LOW_STOCK_ROASTED_KG` | `5` |

### Step 4: Deploy

Click **Deploy**. Vercel will build and deploy. You'll get a shareable URL like `https://moreine-ops-dashboard.vercel.app`.

---

## 5. Supabase Auth — Redirect URL

After deploying to Vercel, add your production URL to Supabase:

1. Dashboard → **Authentication → URL Configuration**
2. Set **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| CSV parsing | PapaParse |
| Charts | Recharts |
| Deploy | Vercel |

---

## 7. Database Schema Overview

```
green_inventory     → roast_batches → roasted_stock
                                         ↓
                                    stock_movements (auto, via triggers)
                                         ↑
sales_log           ────────────────────┘
```

All inventory-changing writes automatically create a `stock_movements` row via PostgreSQL triggers. Multi-step business logic (deduct green on roast, auto-create roasted stock) is handled in Next.js Server Actions for easier debugging.

---

## 8. Clearing Demo Data

Before going live, clear the seed data:

```sql
-- Run in Supabase SQL Editor (order matters due to FK constraints)
DELETE FROM sales_log;
DELETE FROM stock_movements;
DELETE FROM roasted_stock;
DELETE FROM roast_batches;
DELETE FROM green_inventory;
```
