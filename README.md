# MycoZenith

> Premium functional mushroom supplements — built on evidence, not hype.

A full-stack e-commerce storefront built with Next.js 16, Supabase, and Tailwind CSS v4. Features a public-facing product/blog site and a private admin panel for managing content, orders, and customers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth & DB | Supabase (Auth + Postgres + RLS) |
| Analytics | Vercel Analytics |
| Charts | Recharts |
| Fonts | Geist Sans · Playfair Display |
| Deployment | Vercel |

---

## Features

### Public Site
- **Homepage** — Hero, product showcase, testimonials, blog preview, brand story
- **Products** — Grid with search, category filters, sort, and pagination
- **Product Detail** — Image gallery, benefits, how-to-use, FAQs, testimonials
- **Blog** — Article listing with category filter and search; full-page rich article view
- **About** — Brand story, values, and timeline
- **My Account** — Profile editing, order history with tracking, password reset
- **Cookie Consent** — GDPR-friendly banner with accept/decline

### Admin Panel (`/admin`)
- **Dashboard** — Revenue stats, order metrics, low stock alerts
- **Products** — Create, edit, duplicate, delete; image uploads; rich product data
- **Blog** — Block-based content editor (paragraph, heading, quote, image, product embed, list, divider)
- **Orders** — Status management with tracking ID updates
- **Customers** — User list via Supabase service role
- **Analytics** — Revenue and orders charts (last 30/14 days)
- **Settings** — Brand, shipping, and payment configuration

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/Alpha-Blitz/MycoZenith_v1.git
cd MycoZenith_v1/mycozenith
npm install
```

### 2. Environment variables

Create a `.env.local` file in the `mycozenith/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY` is server-only — never prefix with `NEXT_PUBLIC_`.

### 3. Database setup

Run the full schema in your Supabase SQL Editor. Tables required:

- `products` — product catalogue with JSONB fields for bullets, benefits, FAQs
- `blog_posts` — posts with block-based `content` JSONB
- `orders` + `order_items` — order management
- `admin_users` — role table (UUID allowlist)
- `settings` — key-value store for brand/shipping/payment config

Then insert your user UUID into `admin_users`:

```sql
insert into public.admin_users (user_id) values ('your-auth-user-uuid');
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages (Navbar + Footer)
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product listing + detail
│   │   ├── blog/          # Blog listing + article
│   │   ├── about/
│   │   ├── account/       # My Account (auth-protected)
│   │   └── loading.tsx    # Page transition loader
│   ├── (admin)/           # Admin panel (admin_users-protected)
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── blog/
│   │       ├── orders/
│   │       ├── customers/
│   │       ├── analytics/
│   │       └── settings/
│   ├── api/admin/         # REST API routes (products, blog, orders, settings, seed)
│   └── auth/callback/     # Supabase auth callback handler
├── components/
│   ├── admin/             # Admin-only components (Sidebar, BlockEditor, ProductForm…)
│   └── ...                # Public components (Navbar, Footer, ProductCard, CookieConsent…)
├── context/
│   └── AuthContext.tsx    # Supabase auth session + modal state
└── lib/
    ├── supabase/          # client / server / service Supabase clients
    ├── admin/             # Server-side data helpers
    ├── products.ts        # Product types + static data
    └── blog.ts            # Blog types + static data
```

---

## Deployment

Push to `main` — Vercel auto-deploys. Add the three environment variables in your Vercel project settings before the first deploy.

```bash
git push origin main
```

Vercel Analytics is enabled automatically once the project is linked to a Vercel deployment.

---

## Admin Access

The admin panel at `/admin` is protected by edge middleware. Only users whose UUID exists in the `admin_users` Supabase table can access it. The gear icon in the Navbar (visible when logged in) links directly to `/admin`.

---

## License

Private — all rights reserved.
