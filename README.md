# DEMO — Luxury Salon & Spa Atelier

An elegant, high-performance salon and spa web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. 

Designed with a modern luxury aesthetic (cream, blush, charcoal, and warm gold accents), serif typography (`Playfair Display`), clean modern sans (`Plus Jakarta Sans`), micro-animations, and full responsiveness across mobile, tablet, and desktop screens.

---

## 🌟 Features Overview

### 1. Public Experience
- **Home (`/`)**:
  - Sticky glassmorphic navbar with quick hotline and mobile navigation drawer.
  - Luxury hero section with value propositions, trust badges, and floating appointment triggers.
  - Featured signature treatments with live dynamic pricing and duration.
  - "The DEMO Standard" — 6 luxury care pillars.
  - Architectural visual gallery showcase with smooth hover transitions.
  - Real client testimonials and reviews.
  - Quick consultation banner and comprehensive luxury footer.
- **Services Catalog (`/services`)**:
  - Filterable by categories: *Hair*, *Skin*, *Nails*, *Bridal & Makeup*, and *Grooming*.
  - Real-time search by treatment name or keyword.
  - Direct "Book This Service" CTA preselecting the treatment on `/book`.
- **Booking Flow (`/book`)**:
  - Step 1: Multi-service selection with running totals (price & duration) and category filters.
  - Step 2: Date picker (no past dates) + 30-min time slot grid (10:00 AM – 7:00 PM). **Double-booking prevention** automatically locks slots already reserved on that date.
  - Step 3: Guest details form with strict 10-digit phone validation, optional email, and custom notes.
  - Step 4: Transparent review summary with itemized prices and estimated durations.
  - Step 5: Confetti celebration confirmation screen with unique booking reference ID (e.g. `DEMO-8921`) and direct links to the admin panel.
- **Contact & Directions (`/contact`)**:
  - Sanctuary address, hours, direct phone, email, and one-click WhatsApp concierge chat.
  - Interactive consultation inquiry form with instant toast alerts.
  - Valet parking, elevator, and accessibility information.

### 2. Admin Portal (`/admin`)
- **Protected Authentication**:
  - Demo login screen with hardcoded credentials:
    - **Username:** `admin`
    - **Password:** `admin123`
  - One-click auto-fill chip for convenient demo testing.
  - Session securely remembered in browser storage.
- **Live Metrics Dashboard**:
  - Total Bookings counter.
  - Today's Appointments with date indicator.
  - Pending Approval counter.
  - Settled Revenue calculated automatically from completed visits.
- **Bookings Management Table**:
  - Search by guest name, phone, booking ID, or treatment.
  - Filter by status (*All*, *Pending*, *Confirmed*, *Completed*, *Cancelled*).
  - Filter by date (*All*, *Today*, or *Custom date picker*).
  - Sort by newest or oldest.
  - Inline status update dropdown that persists immediately.
  - Detailed appointment modal with complete customer notes, itemized treatments, and guest contact.
  - Delete appointment with confirmation.
- **Services Menu Management**:
  - Add new treatments (name, category, price in ₹, duration in minutes, description, and Unsplash photo).
  - Edit existing treatments.
  - Toggle active/hidden status (hidden treatments immediately vanish from the public booking and menu views).
  - Delete treatments.
- **Cross-Tab Real-Time Sync**:
  - Utilizes browser `storage` event listeners alongside custom window dispatchers.
  - If a booking is placed in another tab or window, the admin panel updates **instantly without requiring a manual page reload**.
- **Reset Demo Data**:
  - One-click restoration of initial sample bookings and seed services.

---

## ⚠️ Important Demo Notice (LocalStorage Architecture)

> **Important Demo Limitation Note:**
> All appointment and service data is stored in the browser's `localStorage` wrapped inside [`lib/storage.ts`](lib/storage.ts).
> 
> Because data resides in the local browser:
> - Bookings made on a customer's phone or another machine **will not appear** in the admin panel on your client's computer unless accessed on the **same browser profile / machine**.
> - For a client demonstration, opening the customer booking page in one browser tab and the Admin Panel (`/admin`) in an adjacent tab demonstrates real-time cross-tab updates seamlessly.

---

## 🔌 Connecting a Real Database (Production Next Steps)

The codebase isolates all data access within [`lib/storage.ts`](lib/storage.ts). To transition from the browser demo to a production multi-device system with a database:

### 1. Using Supabase (Recommended)
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Install the client: `npm install @supabase/supabase-js`.
3. Create two tables in Supabase:
   - `services`: `id (text)`, `name (text)`, `category (text)`, `price (numeric)`, `duration (integer)`, `image (text)`, `is_active (boolean)`.
   - `bookings`: `id (text)`, `customer_name (text)`, `customer_phone (text)`, `customer_email (text)`, `customer_notes (text)`, `service_ids (jsonb)`, `services_summary (jsonb)`, `total_price (numeric)`, `total_duration (integer)`, `date (text)`, `time (text)`, `status (text)`, `created_at (timestamptz)`.
4. Swap the methods in `lib/storage.ts` or create API routes (`/api/bookings`, `/api/services`) querying Supabase.
5. Enable Supabase Realtime so multiple devices (e.g. mobile customer + desktop receptionist) get instant WebSocket updates.

### 2. Using PostgreSQL with Prisma / Drizzle
1. Install Prisma: `npm install @prisma/client` and `npm install -D prisma`.
2. Define models in `schema.prisma`.
3. Create server actions or Route Handlers in `app/api/bookings/route.ts`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.14)
- npm or pnpm

### Running Locally
```bash
# Run local development server
npm run dev

# Open in browser:
# Public site:  http://localhost:3000
# Booking flow: http://localhost:3000/book
# Admin portal: http://localhost:3000/admin
```

### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
├── app/
│   ├── layout.tsx         # Root layout with Playfair Display & Plus Jakarta Sans
│   ├── globals.css        # Tailwind v4 theme, gold gradients & glassmorphism
│   ├── page.tsx           # Luxury Home Page
│   ├── services/page.tsx  # Catalog of treatments with category filters
│   ├── book/page.tsx      # 4-step wizard with real-time double-booking guard
│   ├── contact/page.tsx   # Contact, directions & WhatsApp concierge
│   └── admin/page.tsx     # Admin dashboard, bookings table & service editor
├── components/
│   ├── Navbar.tsx         # Glassmorphic sticky header with mobile menu
│   ├── Footer.tsx         # Dark luxury footer with hours & location
│   ├── Hero.tsx           # Home hero with luxury imagery & trust metrics
│   ├── ServiceCard.tsx    # Standalone treatment card with booking trigger
│   ├── FeaturedServices.tsx
│   ├── WhyChooseUs.tsx    # 6 luxury care pillars
│   ├── Gallery.tsx        # High-res atelier interior tour
│   ├── Testimonials.tsx   # Verified patron praise with star ratings
│   └── Toast.tsx          # Micro notification system
├── data/
│   └── services.ts        # Seed treatments across Hair, Skin, Nails, Bridal, Grooming
├── lib/
│   ├── storage.ts         # Browser localStorage API with sync & conflict checks
│   └── utils.ts           # Currency (₹ INR), duration & date helpers
└── types/
    └── index.ts           # TypeScript interfaces for Bookings, Services, and Status
```
