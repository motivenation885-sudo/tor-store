# The Outfit Room — Store

Full-stack storefront: product catalog + admin panel + WhatsApp/cart order flow + order logging.
Frontend and backend are both Next.js (API routes = backend). Data and images are stored in **Supabase** (free hosted Postgres + file storage) so everything persists properly even on free hosting tiers that don't keep local files (like Render's free plan or Vercel).

## One-time setup: Supabase (free, ~10 minutes)

1. Go to **supabase.com** → create a free account → **New Project**. Pick any name/password/region.
2. Once the project is ready, go to the **SQL Editor** (left sidebar) → New Query, paste this, and run it:

```sql
create table products (
  id text primary key,
  name text not null,
  price int not null,
  mrp int not null,
  category text not null,
  sizes jsonb not null,
  images jsonb not null,
  rating numeric default 4.2,
  created_at timestamptz default now()
);

create table orders (
  id text primary key,
  product_name text not null,
  price int not null,
  size text not null,
  customer_name text,
  customer_phone text,
  status text default 'new',
  created_at timestamptz default now()
);

insert into products (id, name, price, mrp, category, sizes, images, rating) values
('p1', 'Oversized Drop-Shoulder Tee', 599, 999, 'Tshirts', '["S","M","L","XL"]', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"]', 4.3),
('p2', 'Denim Jacket', 1799, 2599, 'Jackets', '["M","L","XL"]', '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"]', 4.5);
```

3. Go to **Storage** (left sidebar) → **New Bucket** → name it exactly `product-images` → toggle **Public bucket** ON → Create.
4. Go to **Project Settings → API** (left sidebar, gear icon) → copy two values:
   - **Project URL** → this is your `SUPABASE_URL`
   - **service_role key** (under "Project API keys" — NOT the "anon" key) → this is your `SUPABASE_SERVICE_KEY`. Keep this secret, never share it publicly or commit it to GitHub.

## Before you launch — set these 3 environment variables

Wherever you deploy (Render, Vercel, or locally), set:
- `ADMIN_PASSWORD` — your own admin password (default is `tor2026`, change it)
- `SUPABASE_URL` — from step 4 above
- `SUPABASE_SERVICE_KEY` — from step 4 above

Also open `lib/config.js` and change `WHATSAPP_NUMBER` to your real number.

## Run locally

Create a file called `.env.local` in the project root with:
```
ADMIN_PASSWORD=your-password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```
Then:
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` for the store, `http://localhost:3000/admin` for the admin panel.

## Deploy on Render (free)

1. Push this project to GitHub (if not already).
2. On Render: **New → Web Service** → connect your GitHub repo.
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Under **Environment**, add the 3 variables listed above.
6. Deploy. Render gives you a live `.onrender.com` URL.

Note: Render's free tier spins the service down after inactivity — first visit after a quiet period takes ~30-50 seconds to wake up. Your data is safe either way since it's stored in Supabase now, not on Render's disk.

## Deploy on Vercel (when ready to go fully live)

Same 3 environment variables, set under Project Settings → Environment Variables. Vercel works natively with this setup since nothing relies on local disk anymore.

## What's inside

- `pages/index.js` — storefront homepage (catalog, category filter, product bottom-sheet)
- `pages/admin/index.js` — password-protected admin (add/edit/remove products, view logged orders)
- `pages/cart.js` — cart page with quantity controls and WhatsApp checkout
- `pages/api/products.js` — GET/POST/PUT/DELETE products, backed by Supabase
- `pages/api/orders.js` — logs every checkout so you can track placed-vs-accepted later
- `pages/api/upload.js` — handles product image uploads to Supabase Storage
- `lib/db.js` — all Supabase database queries
- `lib/supabase.js` — Supabase client setup
- `lib/config.js` — WhatsApp number, categories, helper functions
- `lib/cart.js` — cart state (persisted in browser localStorage)
- `components/` — ProductCard, ProductModal (mobile bottom-sheet + WhatsApp/cart flow)

## Admin panel

Go to `/admin`, log in with your password. Two tabs:
- **Products** — add new items with real uploaded photos, edit existing ones, remove old ones.
- **Orders** — every checkout gets logged here with customer name/phone and timestamp.
