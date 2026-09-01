# Moreine Ops Dashboard

Internal operations dashboard for **Moreine Coffee Roastery** — a full-stack inventory and sales management system built for roastery staff.

---

## What It Does

| Module | Description |
|---|---|
| **Dashboard** | Live KPIs: green stock, roasted stock, average yield, low-stock alerts. Yield trend chart. |
| **Green Inventory** | Track coffee lots by origin, supplier, arrival date, initial and remaining kg. CSV import/export. |
| **Roasting** | Log roast batches with input/output kg. Yield % auto-calculated. |
| **Roasted Inventory** | Track roasted stock by state (bulk/packed) and channel (bar, B2C, B2B). Channel split chart. |
| **Sales** | Log sales by channel (B2C, B2B). Revenue over time chart. |
| **Movements** | Immutable ledger of all stock movements (auto-populated via database triggers). |
| **Settings** | Language toggle (EN/AR with full RTL support) and light/dark mode. |

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, server components)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Styling**: Tailwind CSS with a custom semantic design token system
- **Charts**: ApexCharts via `react-apexcharts`
- **Language**: TypeScript throughout

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/<your-org>/moreine-ops-dashboard.git
cd moreine-ops-dashboard
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Low-stock alert thresholds (kg)
NEXT_PUBLIC_LOW_STOCK_GREEN_KG=60
NEXT_PUBLIC_LOW_STOCK_ROASTED_KG=5
```

Get these values from your [Supabase project settings → API](https://supabase.com/dashboard/project/_/settings/api).

### 3. Set up the database

Run the files in `supabase/` against your Supabase project in this order via the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new):

```
supabase/migrations/001_schema.sql   # Tables, triggers, indexes
supabase/rls.sql                     # Row Level Security policies
supabase/seed.sql                    # Optional: demo data (remove before production)
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to the sign-in page.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Deploy — Vercel auto-detects Next.js, no extra configuration needed

---

## Project Structure

```
src/
├── app/
│   ├── admin/             # All authenticated pages
│   │   ├── dashboard/
│   │   ├── green-inventory/
│   │   ├── roasting/
│   │   ├── roasted-inventory/
│   │   ├── sales/
│   │   ├── movements/
│   │   └── settings/
│   └── auth/sign-in/
├── components/
│   ├── ui/                # Shared: PageHeader, Table, ChartCard, Button
│   ├── card/              # Base Card component
│   ├── sidebar/           # Sidebar + nav links
│   └── charts/            # ApexCharts wrappers (LineChart, BarChart, PieChart)
├── lib/
│   ├── supabase/          # Browser and server Supabase clients
│   └── i18n/             # Translations (EN + AR, 135 keys each)
supabase/
├── migrations/001_schema.sql
├── rls.sql
└── seed.sql
```

---

## Arabic / RTL Support

- The entire UI switches to full RTL layout when Arabic is selected in Settings
- All UI strings are translated (135 keys, EN + AR)
- Language preference is persisted in a cookie and applied server-side on every page load
- Logical CSS properties (`ms-`, `me-`, `start-`, `end-`) are used throughout for correct RTL behavior

---

## License

Private — Moreine Coffee Roastery internal use only.