# 🥟 Momoza — Website Technical Plan

> **Purpose:** Full website + admin panel where owner can manage everything  
> **Developer:** Farhan  
> **Date:** June 20, 2026

---

## 1. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR for SEO, API routes built-in, one project for site + admin |
| **Language** | TypeScript | Type safety, fewer bugs |
| **Styling** | Tailwind CSS v4 | Rapid UI development, responsive |
| **Database** | Supabase (PostgreSQL) | Free tier, auth, storage, real-time |
| **Auth** | Supabase Auth | Admin login, secure |
| **Image Storage** | Supabase Storage | Menu photos, hero images, slides |
| **Hosting** | Vercel (free tier) | Zero cost, auto-deploy from GitHub |
| **Domain** | momoza.in | ~₹500-800/year |
| **WhatsApp** | wa.me deep links | Free ordering |
| **Analytics** | Google Analytics | Free traffic tracking |

**Total recurring cost: ₹0/month** (only domain ~₹500/year)

---

## 2. Architecture

```
┌─────────────────────────────────────────────┐
│                  NEXT.JS APP                │
├──────────────────┬──────────────────────────┤
│  PUBLIC WEBSITE  │      ADMIN PANEL         │
│  /               │      /admin/*            │
│  /menu           │      /admin/dashboard    │
│  /about          │      /admin/menu         │
│  /contact        │      /admin/hero         │
│  /reviews        │      /admin/slides       │
│  /order          │      /admin/orders       │
│                  │      /admin/reviews       │
│                  │      /admin/settings      │
├──────────────────┴──────────────────────────┤
│              API ROUTES (/api/*)            │
│  /api/menu  /api/orders  /api/hero          │
│  /api/slides  /api/reviews  /api/settings   │
│  /api/upload  /api/auth                     │
├─────────────────────────────────────────────┤
│              SUPABASE                       │
│  PostgreSQL DB │ Auth │ Storage (images)    │
└─────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 `site_settings`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| brand_name | text | "Momoza" |
| tagline | text | Hero tagline |
| description | text | About section |
| phone | text | Contact number |
| whatsapp_number | text | For order links |
| email | text | Contact email |
| address | text | Location |
| delivery_radius | text | "0-5 km" |
| operating_hours | text | "11 AM - 10 PM" |
| instagram_url | text | Social link |
| google_maps_url | text | Embed link |
| min_order_amount | integer | Minimum ₹ for delivery |
| delivery_charge | integer | ₹ |
| is_accepting_orders | boolean | Toggle orders on/off |
| updated_at | timestamp | |

### 3.2 `hero_section`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| heading | text | Main heading |
| subheading | text | Sub text |
| cta_text | text | Button text |
| background_image | text | Storage URL |
| is_active | boolean | Show/hide |
| sort_order | integer | Display order |

### 3.3 `menu_categories`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| name | text | "Veg Momos", "Non-Veg" |
| description | text | Category description |
| sort_order | integer | Display order |
| is_active | boolean | Show/hide |

### 3.4 `menu_items`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| category_id | uuid (FK) | Links to category |
| name | text | "Chicken Momos" |
| description | text | Item description |
| price | integer | Price in ₹ |
| pieces | integer | Number of pieces |
| image_url | text | Storage URL |
| is_vegetarian | boolean | Veg tag |
| is_bestseller | boolean | Bestseller badge |
| is_available | boolean | In stock toggle |
| sort_order | integer | Display order |
| created_at | timestamp | |

### 3.5 `slides` (Homepage carousel)
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| title | text | Slide title |
| subtitle | text | Slide subtitle |
| image_url | text | Storage URL |
| link_url | text | Optional CTA link |
| is_active | boolean | Show/hide |
| sort_order | integer | Display order |

### 3.6 `reviews`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| customer_name | text | |
| rating | integer | 1-5 stars |
| review_text | text | |
| is_approved | boolean | Admin approves |
| is_featured | boolean | Show on homepage |
| created_at | timestamp | |

### 3.7 `orders`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| order_number | text | "MZ-001" auto-generated |
| customer_name | text | |
| customer_phone | text | |
| customer_address | text | |
| items | jsonb | Array of {name, qty, price} |
| total_amount | integer | |
| status | text | pending/confirmed/delivered/cancelled |
| notes | text | Special instructions |
| created_at | timestamp | |

### 3.8 `about_section`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | |
| title | text | Section title |
| story | text | Brand story (rich text) |
| image_url | text | Family/kitchen photo |
| highlights | jsonb | Array of USP items |
| updated_at | timestamp | |

---

## 4. Public Website Pages

### 4.1 Home Page (`/`)
- **Hero Section** — Full-width image/video, heading, tagline, "Order Now" CTA
- **USP Strip** — 3-4 highlights: "Homemade", "Fresh Daily", "₹45 Onwards", "Free Delivery"
- **Featured Menu** — Top 4 bestseller items with "View Full Menu" link
- **How It Works** — 3 steps: Browse → Order on WhatsApp → Enjoy
- **Slides/Carousel** — Promotional banners (offers, new items, festivals)
- **Reviews Section** — 3-4 featured customer reviews
- **CTA Banner** — "Hungry? Order Now!" with WhatsApp button

### 4.2 Menu Page (`/menu`)
- Category tabs/filters (Veg, Non-Veg, Combos, Special)
- Grid of menu items with photo, name, price, description, veg/non-veg badge
- "Add to Cart" button on each item
- Floating cart summary bar at bottom
- Cart → enters customer details → generates WhatsApp message

### 4.3 About Page (`/about`)
- Brand story with family photo
- "Why Homemade?" section
- Kitchen/preparation photos
- USP highlights with icons
- FSSAI badge (when obtained)

### 4.4 Reviews Page (`/reviews`)
- All approved customer reviews
- Star ratings display
- "Leave a Review" form (submitted to admin for approval)

### 4.5 Contact Page (`/contact`)
- WhatsApp direct chat button
- Phone number with click-to-call
- Operating hours
- Delivery area with radius info
- Google Maps embed
- Simple contact form

### 4.6 Order Flow (integrated on Menu page)
```
Select Items → View Cart → Enter Details → Review Order → Send via WhatsApp
```

The WhatsApp message auto-generates:
```
🥟 *New Order — Momoza*

*Items:*
• Veg Momos x2 — ₹90
• Chicken Momos x1 — ₹50

*Total: ₹140*

*Name:* [Customer Name]
*Phone:* [Number]
*Address:* [Address]
*Payment:* Cash on Delivery
```

---

## 5. Admin Panel Pages

### 5.1 Login (`/admin/login`)
- Email + password login via Supabase Auth
- Only pre-authorized admin emails can access
- Session-based, auto-logout after inactivity

### 5.2 Dashboard (`/admin/dashboard`)
- Today's orders count + revenue
- This week/month summary
- Recent 10 orders list
- Quick stats: total customers, avg order value, top items
- Orders chart (daily/weekly)

### 5.3 Menu Manager (`/admin/menu`)
- **Categories:** Add/edit/delete/reorder categories
- **Items:** Add/edit/delete menu items
- Upload item photo (auto-compressed)
- Toggle availability (in stock / out of stock)
- Set bestseller badge
- Drag-and-drop reorder

### 5.4 Hero & Slides (`/admin/hero`)
- Edit hero heading, subheading, CTA text
- Upload/change hero background image
- Manage carousel slides: add/edit/delete/reorder
- Preview changes before publishing

### 5.5 Orders (`/admin/orders`)
- List all orders with filters (date, status)
- Update order status (pending → confirmed → delivered)
- View order details
- Search by customer name/phone
- Export orders to CSV

### 5.6 Reviews (`/admin/reviews`)
- View all submitted reviews
- Approve/reject reviews
- Mark as featured (shows on homepage)
- Delete inappropriate reviews

### 5.7 About Page Editor (`/admin/about`)
- Edit brand story text
- Upload/change about page images
- Edit USP highlights

### 5.8 Site Settings (`/admin/settings`)
- Brand name, tagline
- Phone, WhatsApp number, email
- Address, operating hours
- Delivery settings (radius, charges, minimum order)
- Social media links
- Toggle "Accepting Orders" on/off
- Instagram/Google Maps URLs

---

## 6. Project Structure

```
momoza-website/
├── public/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Homepage
│   │   ├── menu/page.tsx           # Menu page
│   │   ├── about/page.tsx          # About page
│   │   ├── contact/page.tsx        # Contact page
│   │   ├── reviews/page.tsx        # Reviews page
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout (sidebar, auth guard)
│   │   │   ├── login/page.tsx      # Admin login
│   │   │   ├── dashboard/page.tsx  # Dashboard
│   │   │   ├── menu/page.tsx       # Menu manager
│   │   │   ├── hero/page.tsx       # Hero & slides editor
│   │   │   ├── orders/page.tsx     # Orders list
│   │   │   ├── reviews/page.tsx    # Reviews manager
│   │   │   ├── about/page.tsx      # About editor
│   │   │   └── settings/page.tsx   # Site settings
│   │   └── api/
│   │       ├── menu/route.ts
│   │       ├── orders/route.ts
│   │       ├── hero/route.ts
│   │       ├── slides/route.ts
│   │       ├── reviews/route.ts
│   │       ├── settings/route.ts
│   │       └── upload/route.ts
│   ├── components/
│   │   ├── public/                 # Website components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MenuCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── Carousel.tsx
│   │   └── admin/                  # Admin components
│   │       ├── Sidebar.tsx
│   │       ├── StatsCard.tsx
│   │       ├── DataTable.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── MenuItemForm.tsx
│   │       └── OrderCard.tsx
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── supabase-server.ts      # Server-side client
│   │   ├── whatsapp.ts             # WhatsApp message builder
│   │   └── utils.ts                # Helpers
│   ├── hooks/
│   │   ├── useCart.ts              # Cart state management
│   │   └── useAuth.ts             # Admin auth hook
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── .env.local                      # Supabase keys
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## 7. Key Features Detail

### 7.1 Cart System (Client-side)
- Uses React Context + localStorage
- No backend needed for cart
- Items stored locally until WhatsApp send
- Cart persists across page navigation

### 7.2 Image Upload Flow
```
Admin uploads image
    → Client compresses to WebP (browser-side)
    → Uploads to Supabase Storage bucket
    → Gets public URL
    → Saves URL to database record
```

### 7.3 WhatsApp Message Builder
```typescript
function buildWhatsAppMessage(cart, customer): string {
  // Formats items, total, customer info
  // Returns encoded URL: wa.me/{number}?text={message}
}
```

### 7.4 Admin Auth Flow
```
Admin visits /admin/*
    → Middleware checks Supabase session
    → No session → redirect to /admin/login
    → Valid session → check if email is in allowed list
    → Authorized → render admin page
```

---

## 8. Design System

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Primary Red | #E63946 | CTA buttons, accents |
| Warm Orange | #F4845F | Highlights, badges |
| Cream | #FFF8F0 | Backgrounds |
| Dark | #1D1D1D | Text, admin panel |
| Charcoal | #2B2B2B | Admin sidebar |
| White | #FFFFFF | Cards, content areas |
| Success Green | #2ECC71 | Available, confirmed |
| Muted Gray | #6B7280 | Secondary text |

### Typography
- **Headings:** Outfit (Google Font) — bold, modern
- **Body:** Inter (Google Font) — clean, readable
- **Accent:** Playfair Display — for taglines/quotes

### Design Principles
- Mobile-first (80%+ traffic will be mobile)
- Warm, appetizing colors
- Large food imagery
- Smooth animations (Framer Motion)
- Glassmorphism cards for premium feel
- Dark mode admin panel for contrast

---

## 9. API Routes

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/menu | Get all categories + items | Public |
| POST | /api/menu | Add menu item | Admin |
| PUT | /api/menu/[id] | Update menu item | Admin |
| DELETE | /api/menu/[id] | Delete menu item | Admin |
| GET | /api/hero | Get hero + slides | Public |
| PUT | /api/hero | Update hero section | Admin |
| POST | /api/slides | Add slide | Admin |
| PUT | /api/slides/[id] | Update slide | Admin |
| DELETE | /api/slides/[id] | Delete slide | Admin |
| GET | /api/reviews | Get approved reviews | Public |
| POST | /api/reviews | Submit review | Public |
| PUT | /api/reviews/[id] | Approve/reject | Admin |
| POST | /api/orders | Create order (logs it) | Public |
| GET | /api/orders | Get all orders | Admin |
| PUT | /api/orders/[id] | Update status | Admin |
| GET | /api/settings | Get site settings | Public |
| PUT | /api/settings | Update settings | Admin |
| POST | /api/upload | Upload image | Admin |
| GET | /api/dashboard | Get stats | Admin |

---

## 10. Development Phases

### Phase 1: Setup & Foundation (Day 1-2)
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Set up Supabase project (DB, Auth, Storage)
- [ ] Create all database tables
- [ ] Configure environment variables
- [ ] Set up project structure
- [ ] Install dependencies (framer-motion, lucide-react, etc.)

### Phase 2: Public Website (Day 3-6)
- [ ] Navbar + Footer components
- [ ] Homepage (hero, featured menu, USPs, reviews, CTA)
- [ ] Menu page with category filters
- [ ] Cart system (context + localStorage)
- [ ] WhatsApp order flow
- [ ] About page
- [ ] Contact page
- [ ] Reviews page with submission form
- [ ] Responsive design + animations
- [ ] SEO meta tags

### Phase 3: Admin Panel (Day 7-10)
- [ ] Admin login page + auth middleware
- [ ] Admin layout (sidebar navigation)
- [ ] Dashboard with stats + charts
- [ ] Menu manager (CRUD + image upload)
- [ ] Hero & slides editor
- [ ] Orders management
- [ ] Reviews approval system
- [ ] About page editor
- [ ] Site settings editor
- [ ] Image upload component

### Phase 4: Polish & Deploy (Day 11-12)
- [ ] Loading states + error handling
- [ ] Mobile responsiveness testing
- [ ] Performance optimization (image lazy loading, etc.)
- [ ] Deploy to Vercel
- [ ] Connect custom domain
- [ ] Set up Google Analytics
- [ ] Final testing

**Total estimated time: 12 working days**

---

## 11. Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "framer-motion": "^11.x",
    "lucide-react": "latest",
    "recharts": "^2.x",
    "react-hot-toast": "^2.x",
    "browser-image-compression": "^2.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@types/react": "^19.x"
  }
}
```

---

## 12. Deployment Checklist

- [ ] Push code to GitHub (private repo)
- [ ] Connect repo to Vercel
- [ ] Add environment variables on Vercel
- [ ] Configure custom domain (momoza.in)
- [ ] Set up SSL (auto with Vercel)
- [ ] Supabase Row Level Security policies
- [ ] Test all admin functions on production
- [ ] Set up Supabase backups
- [ ] Add Google Analytics tracking code
- [ ] Create first admin account

---

## 13. Security Considerations

| Area | Implementation |
|---|---|
| **Admin Auth** | Supabase Auth with email allowlist |
| **API Protection** | Middleware checks session on all /admin and admin API routes |
| **Image Upload** | File type validation, size limits (max 5MB) |
| **SQL Injection** | Supabase client uses parameterized queries |
| **RLS** | Row Level Security on all tables |
| **CORS** | Next.js API routes handle CORS automatically |
| **Environment** | All secrets in .env.local, never committed |

---

*Ready to start building. First step: Initialize the Next.js project and set up Supabase.*
