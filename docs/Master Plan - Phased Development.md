# 🥟 Momoza — Master Development Plan

> **Total Phases:** 15 | **Est. Timeline:** 14-18 working days  
> **Stack:** Next.js 15 + TypeScript + Tailwind CSS v4 + Supabase  
> **Status:** 🔴 Not Started

---

## Phase 1: Project Initialization
**Duration:** Day 1 (Morning) | **Status:** `[x]`

### 1.1 Create Next.js Project
- `[x]` Run `npx -y create-next-app@latest ./` with TypeScript, Tailwind, App Router, src directory
- `[x]` Verify dev server runs successfully
- `[x]` Clean up boilerplate files (remove default page content, globals)

### 1.2 Install Dependencies
- `[x]` `@supabase/supabase-js` — database client
- `[x]` `@supabase/ssr` — server-side auth helpers for Next.js
- `[x]` `framer-motion` — animations
- `[x]` `lucide-react` — icon library
- `[x]` `recharts` — charts for admin dashboard
- `[x]` `react-hot-toast` — toast notifications
- `[x]` `browser-image-compression` — client-side image compression before upload
- `[x]` `date-fns` — date formatting
- `[x]` `clsx` + `tailwind-merge` — conditional className merging
- `[x]` `embla-carousel-react` — lightweight carousel (better than building from scratch)
- `[x]` `next-themes` — if adding dark mode toggle on public site later

### 1.3 Project Config
- `[x]` Set up folder structure: `components/public`, `components/admin`, `components/ui`, `lib/`, `hooks/`, `types/`, `constants/`
- `[x]` Create `.env.local` with Supabase URL + Anon Key + Service Role Key placeholders
- `[x]` Configure `next.config.ts` — image domains for Supabase storage, redirect `/admin` → `/admin/dashboard`
- `[x]` Set up path aliases in `tsconfig.json` (`@/` prefix)
- `[x]` Create `.gitignore` — ensure `.env.local`, `node_modules`, `.next` are excluded
- `[x]` Create `README.md` with project overview, setup instructions, environment variables list

---

## Phase 2: Supabase Setup
**Duration:** Day 1 (Afternoon) | **Status:** `[x]`

### 2.1 Create Supabase Project
- `[x]` Create new project on supabase.com (free tier)
- `[x]` Note down Project URL and Anon Key
- `[x]` Add keys to `.env.local`

### 2.2 Create Database Tables
- `[x]` `site_settings` — brand name, tagline, phone, whatsapp, address, hours, delivery settings
- `[x]` `hero_section` — heading, subheading, cta_text, background_image, is_active, sort_order
- `[x]` `menu_categories` — name, description, sort_order, is_active
- `[x]` `menu_items` — name, description, price, pieces, image_url, category_id, is_veg, is_bestseller, is_available, sort_order
- `[x]` `slides` — title, subtitle, image_url, link_url, is_active, sort_order
- `[x]` `reviews` — customer_name, rating, review_text, is_approved, is_featured, created_at
- `[x]` `orders` — order_number, customer_name, phone, address, items(jsonb), total, status, notes, created_at
- `[x]` `about_section` — title, story, image_url, highlights(jsonb)

### 2.3 Storage Buckets
- `[x]` Create `menu-images` bucket (public)
- `[x]` Create `hero-images` bucket (public)
- `[x]` Create `slide-images` bucket (public)
- `[x]` Create `about-images` bucket (public)
- `[x]` Set file size limit to 5MB per bucket
- `[x]` Set allowed MIME types: image/jpeg, image/png, image/webp

### 2.4 Auth Setup
- `[x]` Enable email/password auth in Supabase
- `[x]` Create admin user account (owner's email)
- `[x]` Set up Row Level Security (RLS) policies:
  - Public: SELECT on menu, hero, slides, reviews(approved only), settings, about
  - Public: INSERT on reviews, orders
  - Admin: ALL on every table (authenticated + email match)

### 2.5 Supabase Client Files
- `[x]` Create `src/lib/supabase.ts` — browser client (for client components)
- `[x]` Create `src/lib/supabase-server.ts` — server client (for server components & API routes)
- `[x]` Create `src/lib/supabase-admin.ts` — service role client (for admin operations)

### 2.6 Seed Initial Data
- `[x]` Create `supabase/seed.sql` script so DB can be re-seeded anytime
- `[x]` Insert default `site_settings` row with placeholder values
- `[x]` Insert default `about_section` row
- `[x]` Insert 1 default `hero_section` row
- `[x]` Insert 2-3 sample `menu_categories` (Veg, Non-Veg, Combos)
- `[x]` Insert 4-5 sample `menu_items` with placeholder images

### 2.7 ⚡ Enhancement: Database Functions
- `[x]` Create Supabase DB function `generate_order_number()` — auto-increments MZ-001, MZ-002 etc.
- `[x]` Create DB trigger on `orders` table to auto-set `order_number` on insert
- `[x]` Add `updated_at` column with auto-update trigger on `site_settings`, `menu_items`, `about_section`

---

## Phase 3: TypeScript Types & Utilities
**Duration:** Day 2 (Morning) | **Status:** `[x]`

### 3.1 Type Definitions (`src/types/index.ts`)
- `[x]` `SiteSettings` interface
- `[x]` `HeroSection` interface
- `[x]` `MenuCategory` interface
- `[x]` `MenuItem` interface
- `[x]` `MenuCategoryWithItems` — category with nested items array
- `[x]` `Slide` interface
- `[x]` `Review` interface
- `[x]` `Order` interface with `OrderItem` sub-type
- `[x]` `OrderStatus` union type: `'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'`
- `[x]` `AboutSection` interface
- `[x]` `CartItem` type (extends MenuItem with quantity)
- `[x]` `DashboardStats` type
- `[x]` `ApiResponse<T>` generic type for consistent API responses

### 3.4 ⚡ Enhancement: Constants File (`src/constants/index.ts`)
- `[x]` `ORDER_STATUSES` (with colors for UI badges)
- `[x]` `NAV_LINKS` (for public site header/footer)
- `[x]` `DELIVERY_MESSAGES` (e.g., "Free delivery above ₹500")
- `[x]` `IMAGE_CONFIG` (max upload sizes, allowed dimensions)
- `[x]` `WHATSAPP_GREETING`

### 3.2 Utility Functions (`src/lib/utils.ts`)
- `[x]` `formatCurrency(amount)` — ₹ formatting
- `[x]` `truncateText(text, length)` — for descriptions
- `[x]` `getImageUrl(path, bucket)` — resolves Supabase storage public URL
- `[x]` `cn(...classes)` — tailwind-merge utility for dynamic classes

### 3.3 WhatsApp Helper (`src/lib/whatsapp.ts`)
- `[x]` `buildOrderMessage(items, customer, total)` — formats cart into structured text
- `[x]` `getWhatsAppUrl(phoneNumber, message)` — handles wa.me linking with URL encoding

---

## Phase 4: Design System & Global Layout
**Duration:** Day 2 (Afternoon) | **Status:** `[ ]`

### 4.1 Global Styles (`src/app/globals.css`)
- [ ] Import Google Fonts (Outfit, Inter)
- [ ] Define CSS custom properties for color palette:
  - Primary: `#E63946`, Warm: `#F4845F`, Cream: `#FFF8F0`
  - Dark: `#1D1D1D`, Charcoal: `#2B2B2B`, Success: `#2ECC71`
- [ ] Base reset and smooth scrolling
- [ ] Custom scrollbar styling
- [ ] Selection color styling
- [ ] Focus ring styles for accessibility (keyboard navigation)
- [ ] Transition defaults (all elements get smooth 200ms transitions)
- [ ] Text rendering optimization (`-webkit-font-smoothing: antialiased`)

### 4.2 Tailwind Config
- [ ] Extend theme with custom colors matching palette
- [ ] Add custom font families
- [ ] Add custom animations (fadeIn, slideUp, scaleIn)
- [ ] Configure content paths
## Phase 4: UI Primitives & Layout
**Duration:** Day 2 (Afternoon) | **Status:** `[x]`

### 4.1 Global Layout (`src/app/layout.tsx`)
- `[x]` Import Poppins font from `next/font/google`
- `[x]` Wrap children in `<Toaster />` from `react-hot-toast`
- `[x]` Basic SEO meta tags (title template: `%s | Momoza`)

### 4.2 Tailwind Theme (`src/app/globals.css`)
- `[x]` Configure brand colors in Tailwind CSS v4 format (CSS variables + `@theme`)
  - Primary: Orange/Red (#FF6B00, #E63946)
  - Secondary: Warm Yellow/Amber (#FFB703)
  - Background: Cream/Off-white (#FDFBF7)
- `[x]` Add custom animations (fade-in, slide-up)
- `[x]` **Enhancement**: Accessibility focus rings, transition defaults, font smoothing

### 4.3 ⚡ Enhancement: UI Primitives (`src/components/ui/`)
- `[x]` `Button.tsx` (variants: primary, secondary, outline, ghost, sizes: sm, md, lg)
- `[x]` `Input.tsx` / `Textarea.tsx` (consistent focus states)
- `[x]` `Badge.tsx` (for veg/non-veg/bestseller tags)
- `[x]` `Modal.tsx` (for cart & review forms)
- `[x]` `Skeleton.tsx` (for loading states)
- `[x]` `Toggle.tsx` (for admin on/off switches)
- `[x]` `Select.tsx` (styled dropdown select)

### 4.4 Header/Navbar (`src/components/public/Navbar.tsx`)
- `[x]` Logo text "Momoza" with custom font style
- `[x]` Desktop links (Home, Menu, About, Reviews)
- `[x]` Mobile hamburger menu using framer-motion slide-in
- `[x]` Cart icon with dynamic badge count (connects to CartContext later)

### 4.5 Footer (`src/components/public/Footer.tsx`)
- `[x]` 3 columns: Brand info, Quick Links, Contact details
- `[x]` Copyright year dynamic (`new Date().getFullYear()`)
- `[x]` Social media links placeholders

---

## Phase 5: Public Website — Shared Components
**Duration:** Day 3 | **Status:** `[x]`

### 5.1 Navbar (`src/components/public/Navbar.tsx`)
- `[x]` Sticky top navbar with brand logo/name on left
- `[x]` Navigation links: Home, Menu, About, Reviews, Contact
- `[x]` "Order Now" CTA button (prominent, colored)
- `[x]` Mobile hamburger menu with slide-in drawer
- `[x]` Active link highlighting based on current route
- `[x]` Transparent on hero → solid on scroll (scroll listener)
- `[x]` Framer Motion animation on mount

### 5.2 Footer (`src/components/public/Footer.tsx`)
- `[x]` Brand name + tagline
- `[x]` Quick links column (same as nav)
- `[x]` Contact info column (phone, WhatsApp, address)
- `[x]` Operating hours
- `[x]` Social media icons (Instagram link)
- `[x]` "Made with ❤️" credit line
- `[x]` FSSAI badge placeholder
- `[x]` Responsive: stacks on mobile

### 5.3 WhatsApp Floating Button (`src/components/public/WhatsAppButton.tsx`)
- `[x]` Fixed bottom-right floating green WhatsApp icon
- `[x]` Pulse animation to attract attention
- `[x]` Opens WhatsApp chat with pre-filled greeting
- `[x]` Shows on all pages
- `[x]` Tooltip on hover: "Chat with us"
- `[x]` z-index management so it never hides behind modals/drawers

### 5.4 Section Wrapper (`src/components/public/Section.tsx`)
- `[x]` Reusable section component with consistent padding/max-width
- `[x]` Optional title + subtitle props with styled heading
- `[x]` Fade-in animation on scroll (Framer Motion `whileInView`)

### 5.5 Scroll-to-Top Button (`src/components/public/ScrollToTop.tsx`)
- `[x]` Appears after scrolling 400px down
- `[x]` Smooth scroll to top on click
- `[x]` Fade in/out animation
- `[x]` Positioned bottom-right, above WhatsApp button

### 5.6 Page Transition Wrapper (`src/components/public/PageTransition.tsx`)
- `[x]` Framer Motion AnimatePresence wrapper for page transitions
- `[x]` Fade + slight slide-up on page enter
- `[x]` Consistent feel across all public pages

### 5.7 Public Layout (`src/app/(public)/layout.tsx`)
- `[x]` Create route group `(public)` for all public pages
- `[x]` Include Navbar + Footer + WhatsAppButton + ScrollToTop
- `[x]` Fetch `site_settings` from Supabase (server component)
- `[x]` Pass settings to Navbar/Footer via context or props
- `[x]` Create `SiteSettingsContext` so any child component can access settings

### 5.8 ⚡ Enhancement: 404 Not Found Page (`src/app/not-found.tsx`)
- `[x]` Custom branded 404 page with illustration
- `[x]` "Go to Homepage" and "View Menu" buttons
- `[x]` Matches site design, not generic Next.js 404

### 5.9 ⚡ Enhancement: Loading Page (`src/app/(public)/loading.tsx`)
- `[x]` Branded loading screen with Momoza logo/name
- `[x]` Skeleton layout matching page structure
- `[x]` Shows while server components fetch data

---

## Phase 6: Homepage
**Duration:** Day 4 | **Status:** `[x]`

### 6.1 Hero Section (`src/components/public/HeroSection.tsx`)
- `[x]` Full-viewport height section
- `[x]` Background image from Supabase (with dark overlay gradient)
- `[x]` Animated heading text (Framer Motion stagger)
- `[x]` Subheading text
- `[x]` Two CTAs: "Order Now" (primary) + "View Menu" (outline)
- `[x]` Subtle scroll-down indicator arrow at bottom (bouncing animation)
- `[x]` Parallax effect on background image (optional)
- `[x]` Data fetched from `hero_section` table
- `[x]` Fallback gradient background if image fails to load
- `[x]` Text shadow on heading for readability over any image

### 6.2 USP Strip (`src/components/public/USPStrip.tsx`)
- `[x]` Horizontal strip below hero with 4 USPs
- `[x]` Icons + text: "🏠 Homemade", "🔥 Fresh Daily", "💰 ₹45 Onwards", "🚗 Free Delivery"
- `[x]` Subtle background color (cream/light)
- `[x]` Animate in on scroll
- `[x]` Responsive: 2x2 grid on mobile

### 6.3 Featured Menu (`src/components/public/FeaturedMenu.tsx`)
- `[x]` Section title: "Our Bestsellers" or "Most Loved"
- `[x]` Fetch top 4 items where `is_bestseller = true` from Supabase
- `[x]` Display as responsive grid of MenuCard components
- `[x]` "View Full Menu →" link button at bottom
- `[x]` Cards animate in staggered on scroll

### 6.4 Menu Card (`src/components/public/MenuCard.tsx`)
- `[x]` Item image with hover zoom effect
- `[x]` Placeholder/fallback image if no photo uploaded
- `[x]` Item name, description (truncated), price with ₹ symbol
- `[x]` Pieces count display (e.g., "4 pcs")
- `[x]` Veg/Non-veg badge (green/red dot) — standard FSSAI style
- `[x]` "Bestseller" ribbon if flagged
- `[x]` "Out of Stock" overlay + disabled state if unavailable
- `[x]` "Add to Cart" button with micro-animation (scale bounce on click)
- `[x]` Quantity counter if item already in cart (shows +/- instead of Add)
- `[x]` Glassmorphism card style
- `[x]` Responsive sizing

### 6.5 How It Works (`src/components/public/HowItWorks.tsx`)
- `[x]` 3-step visual: "Browse Menu" → "Order on WhatsApp" → "Enjoy Fresh Momos"
- `[x]` Numbered circles with icons
- `[x]` Connecting line/arrow between steps
- `[x]` Animate steps in sequence on scroll

### 6.6 Carousel/Slides (`src/components/public/Carousel.tsx`)
- `[x]` Auto-playing image carousel
- `[x]` Data from `slides` table
- `[x]` Navigation dots at bottom
- `[x]` Left/right arrow buttons
- `[x]` Smooth slide transition (Framer Motion AnimatePresence)
- `[x]` Touch/swipe support on mobile
- `[x]` Pause on hover

### 6.7 Testimonial/Review Section (`src/components/public/TestimonialSection.tsx`)
- `[x]` Fetch top 3 reviews where `is_approved = true` from Supabase
- `[x]` ReviewCard component with name, rating stars, text
- `[x]` "See All Reviews →" link
- `[x]` Carousel style on mobile (swipeable)

### 6.8 CTA Banner (`src/components/public/CTABanner.tsx`)
- `[x]` Full-width colored banner before footer
- `[x]` "Craving Momos? Order Now! 🥟"
- `[x]` Large WhatsApp order button
- `[x]` Gradient background (warm red → orange)

### 6.9 Homepage Assembly (`src/app/(public)/page.tsx`)
- `[x]` Server component — fetch hero, featured items, slides, reviews, settings
- `[x]` Assemble all sections in order
- `[x]` SEO: dynamic metadata from site_settings
- `[x]` Handle empty states gracefully (no reviews yet, no slides yet — hide sections)
- `[x]` Ensure no layout shift (CLS) — proper image dimensions and skeletons

---

## Phase 7: Menu Page
**Duration:** Day 5 | **Status:** `[x]`

### 7.1 Menu Page (`src/app/(public)/menu/page.tsx`)
- `[x]` Server component — fetch all categories + items from Supabase
- `[x]` SEO metadata: "Menu | Momoza — Homemade Momos"
- `[x]` Page header with title + description

### 7.2 Category Tabs (`src/components/public/CategoryTabs.tsx`)
- `[x]` Horizontal scrollable tab bar at top
- `[x]` "All" tab + one tab per active category
- `[x]` Active tab highlighted with underline animation
- `[x]` Clicking tab filters items (client-side)
- `[x]` Sticky below navbar on scroll

### 7.3 Menu Grid
- `[x]` Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- `[x]` Uses MenuCard component from Phase 6.4
- `[x]` Filter animation when switching categories (Framer Motion layout)
- `[x]` "No items in this category" empty state
- `[x]` Show "Out of Stock" overlay on unavailable items

### 7.4 Cart System (`src/hooks/useCart.ts` + `src/components/public/CartProvider.tsx`)
- `[x]` React Context for cart state
- `[x]` Functions: addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount
- `[x]` Persist cart to localStorage (with try-catch for private browsing)
- `[x]` Cart item count badge on navbar (animated counter)
- `[x]` CartProvider wraps public layout
- `[x]` Prevent adding out-of-stock items
- `[x]` Max quantity per item limit (e.g., 20)

### 7.5 Cart Drawer (`src/components/public/CartDrawer.tsx`)
- `[x]` Slide-in drawer from right side
- `[x]` Opens when "Add to Cart" clicked or cart icon clicked
- `[x]` List of cart items with +/- quantity controls
- `[x]` Remove item button (trash icon)
- `[x]` Running total at bottom
- `[x]` "Proceed to Order" button
- `[x]` Empty cart state with "Browse Menu" link
- `[x]` Backdrop overlay, close on outside click

### 7.6 Order Form (`src/components/public/OrderForm.tsx`)
- `[x]` Appears after "Proceed to Order" in cart drawer (or as modal)
- `[x]` Fields: Name (required), Phone (required, 10-digit Indian format), Address (required), Notes (optional)
- `[x]` Order type selector: "Delivery" or "Pickup" (if pickup, hide address)
- `[x]` Order summary with all items + total
- `[x]` Delivery charge display (based on settings, ₹0 if pickup)
- `[x]` Minimum order check — show warning if below minimum, disable submit
- `[x]` "Send Order via WhatsApp" button (green, with WhatsApp icon)
- `[x]` On click: builds WhatsApp message → opens wa.me link
- `[x]` Also POST order to `/api/orders` to log it in database
- `[x]` Clear cart after successful send
- `[x]` Validation: phone format (10 digits), required fields, real-time inline errors
- `[x]` Save customer name/phone to localStorage for next order auto-fill
- `[x]` Show "Order placed!" success animation/confetti before redirect

---

## Phase 8: About, Reviews & Contact Pages
**Duration:** Day 6 | **Status:** `[x]`

### 8.1 About Page (`src/app/(public)/about/page.tsx`)
- `[x]` Fetch `about_section` data from Supabase
- `[x]` Brand story section with large text + image side by side
- `[x]` "Why Homemade?" highlights section with icons
- `[x]` Kitchen/family photo gallery (if multiple images)
- `[x]` FSSAI badge display area
- `[x]` Fade-in animations on scroll
- `[x]` SEO metadata

### 8.2 Reviews Page (`src/app/(public)/reviews/page.tsx`)
- `[x]` Fetch all approved reviews from Supabase, ordered by date
- `[x]` Grid of ReviewCard components
- `[x]` Average rating display at top with total count
- `[x]` "Leave a Review" section at bottom

### 8.3 Review Submission Form (`src/components/public/ReviewForm.tsx`)
- `[x]` Fields: Name, Rating (interactive star selector), Review text
- `[x]` Phone field (optional — for verification)
- `[x]` POST to `/api/reviews` on submit
- `[x]` Success message: "Thanks! Your review will appear after approval." with checkmark animation
- `[x]` Basic spam prevention (honeypot field + rate limit: 1 review per phone per day)
- `[x]` Disable submit button after success to prevent double submit
- `[x]` Character limit on review text (500 chars) with counter

### 8.4 Review Card (`src/components/public/ReviewCard.tsx`)
- `[x]` Customer name with avatar initial circle
- `[x]` Star rating display (filled/empty stars)
- `[x]` Review text
- `[x]` Date display (relative: "2 days ago")
- `[x]` "Featured" badge if is_featured
- `[x]` Subtle card with shadow

### 8.5 Contact Page (`src/app/(public)/contact/page.tsx`)
- `[x]` Fetch settings from Supabase for phone, address, hours, maps
- `[x]` Two-column layout: info left, form/map right
- `[x]` WhatsApp direct chat button (large, prominent)
- `[x]` Click-to-call phone link
- `[x]` Operating hours display with "Open Now" / "Closed" indicator
- `[x]` Delivery area info with radius map or text
- `[x]` Google Maps embed iframe (lazy loaded for performance)
- `[x]` Simple contact/query form (optional — sends to WhatsApp)
- `[x]` Social media links
- `[x]` FAQ accordion section (common questions: delivery time, payment, minimum order)

---

## Phase 9: API Routes
**Duration:** Day 7 | **Status:** `[x]`

### 9.1 Menu API (`src/app/api/menu/route.ts`)
- `[x]` GET: Fetch all categories with their items (joined query), public
- `[x]` POST: Add new menu item (admin auth check)
- `[x]` Return proper JSON responses with status codes

### 9.2 Menu Item API (`src/app/api/menu/[id]/route.ts`)
- `[x]` PUT: Update menu item by ID (admin auth check)
- `[x]` DELETE: Delete menu item by ID (admin auth check)

### 9.3 Category API (`src/app/api/categories/route.ts`)
- `[x]` GET: Fetch all categories, public
- `[x]` POST: Add category (admin)
- `[x]` PUT/DELETE by ID (admin)

### 9.4 Hero API (`src/app/api/hero/route.ts`)
- `[x]` GET: Fetch active hero sections, public
- `[x]` PUT: Update hero section (admin)

### 9.5 Slides API (`src/app/api/slides/route.ts` + `[id]/route.ts`)
- `[x]` GET: Fetch active slides ordered by sort_order, public
- `[x]` POST: Add slide (admin)
- `[x]` PUT: Update slide (admin)
- `[x]` DELETE: Delete slide (admin)

### 9.6 Reviews API (`src/app/api/reviews/route.ts` + `[id]/route.ts`)
- `[x]` GET: Fetch approved reviews, public
- `[x]` POST: Submit new review (public, sets is_approved=false)
- `[x]` PUT: Approve/reject/feature review (admin)
- `[x]` DELETE: Delete review (admin)

### 9.7 Orders API (`src/app/api/orders/route.ts` + `[id]/route.ts`)
- `[x]` POST: Log new order (public — called when WhatsApp order sent)
- `[x]` GET: Fetch all orders with filters (admin)
- `[x]` PUT: Update order status (admin)

### 9.8 Settings API (`src/app/api/settings/route.ts`)
- `[x]` GET: Fetch site settings, public
- `[x]` PUT: Update settings (admin)

### 9.9 About API (`src/app/api/about/route.ts`)
- `[x]` GET: Fetch about section, public
- `[x]` PUT: Update about section (admin)

### 9.10 Upload API (`src/app/api/upload/route.ts`)
- `[x]` POST: Receive image file, upload to Supabase Storage
- `[x]` Validate file type (jpeg, png, webp only)
- `[x]` Validate file size (max 5MB)
- `[x]` Generate unique filename (uuid + original extension) to prevent conflicts
- `[x]` Delete old image from storage when replacing (prevent orphaned files)
- `[x]` Return public URL of uploaded image
- `[x]` Admin auth check

### 9.13 ⚡ Enhancement: API Error Handling Pattern
- `[x]` Consistent error response format: `{ success: false, error: string, code: number }`
- `[x]` Consistent success format: `{ success: true, data: T }`
- `[x]` Rate limiting on public POST routes (reviews, orders) — prevent abuse
- `[x]` Log errors to console with context (route, user, timestamp)

### 9.11 Dashboard API (`src/app/api/dashboard/route.ts`)
- `[x]` GET: Calculate and return stats (admin)
  - Today's orders + revenue
  - This week's orders + revenue
  - This month's orders + revenue
  - Total customers (unique phones)
  - Average order value
  - Top 5 selling items
  - Recent 10 orders

### 9.12 Auth Middleware (`src/middleware.ts`)
- `[x]` Intercept all `/admin/*` routes (except `/admin/login`)
- `[x]` Check for valid Supabase session
- `[x]` Redirect to `/admin/login` if no session
- `[x]` Intercept admin API routes and validate auth

---

## Phase 10: Admin Panel — Layout & Auth
**Duration:** Day 8 (Morning) | **Status:** `[x]`

### 10.1 Admin Login Page (`src/app/admin/login/page.tsx`)
- `[x]` Clean, centered login form
- `[x]` Email + Password fields
- `[x]` "Sign In" button with loading state
- `[x]` Error display for wrong credentials
- `[x]` Supabase signInWithPassword
- `[x]` Redirect to `/admin/dashboard` on success
- `[x]` Dark themed design

### 10.2 Admin Layout (`src/app/admin/(dashboard)/layout.tsx`)
- `[x]` Route group for authenticated admin pages
- `[x]` Left sidebar navigation with icons:
  - Dashboard, Menu, Hero & Slides, Orders, Reviews, About, Settings
- `[x]` Top bar with: brand name, admin email, logout button
- `[x]` Sidebar collapsible on mobile (hamburger toggle)
- `[x]` Active link highlighting
- `[x]` Dark theme (charcoal/dark gray)
- `[x]` Logout function: Supabase signOut → redirect to login

### 10.3 Admin Auth Hook (`src/hooks/useAuth.ts`)
- `[x]` Hook to get current session/user
- `[x]` Loading state while checking auth
- `[x]` Logout function
- `[x]` Auto-redirect if session expires

### 10.4 Shared Admin Components
- `[x]` `StatsCard.tsx` — displays a single stat (icon, label, value, trend arrow up/down)
- `[x]` `DataTable.tsx` — reusable table with sort, search, pagination, row selection
- `[x]` `ImageUploader.tsx` — drag-drop or click to upload, preview, compress, upload to Supabase, delete old image
- `[x]` `ConfirmDialog.tsx` — "Are you sure?" modal for deletes with danger styling
- `[x]` `LoadingSpinner.tsx` — consistent loading indicator
- `[x]` `EmptyState.tsx` — "No data yet" placeholder with icon and action CTA
- `[x]` `PageHeader.tsx` — admin page title + description + action button (e.g., "Add New")
- `[x]` `StatusBadge.tsx` — order status badge with appropriate colors
- `[x]` `Breadcrumbs.tsx` — admin navigation breadcrumbs

---

**⏸️ CONTINUED IN PHASES 11-15 BELOW**

---

## Phase 11: Admin — Dashboard & Menu Manager
**Duration:** Day 8 (Afternoon) + Day 9 | **Status:** `[x]`

### 11.1 Dashboard Page (`src/app/admin/(dashboard)/dashboard/page.tsx`)
- `[x]` Fetch stats from `/api/dashboard`
- `[x]` Top row: 4 StatsCards — Today's Orders, Today's Revenue, This Month Revenue, Total Customers
- `[x]` Comparison indicators: "↑ 15% vs yesterday" style trend labels
- `[x]` Revenue chart (line/bar) using Recharts — last 7 days with tooltips
- `[x]` Top 5 best-selling items list with item images
- `[x]` Recent 10 orders table with status badges + quick status update
- `[x]` Pending orders count with alert badge (if > 0)
- `[x]` Quick action buttons: "Add Menu Item", "View Orders", "Toggle Accepting Orders"
- `[x]` Auto-refresh data every 60 seconds
- `[x]` Loading skeletons while data fetches
- `[x]` Welcome message: "Good morning, [Admin Name]" with time-based greeting

### 11.2 Menu Manager Page (`src/app/admin/(dashboard)/menu/page.tsx`)
- `[x]` Two-panel layout: Categories sidebar + Items main area
- `[x]` Category list with add/edit/delete buttons
- `[x]` "Add Category" form (inline or modal): name, description
- `[x]` Clicking category filters items shown
- `[x]` Items displayed as table or grid (toggle view)
- `[x]` Each item row shows: image thumbnail, name, price, category, veg badge, availability toggle, bestseller toggle, actions

### 11.3 Add/Edit Menu Item (`src/components/admin/MenuItemForm.tsx`)
- `[x]` Modal or slide-over form
- `[x]` Fields: name, description, price (₹), pieces count, category (dropdown)
- `[x]` Image upload with preview (uses ImageUploader component)
- `[x]` Toggles: is_vegetarian, is_bestseller, is_available
- `[x]` Sort order number input
- `[x]` "Save" and "Cancel" buttons
- `[x]` Validation: name required, price > 0, image required
- `[x]` Toast notification on save success/error
- `[x]` Works for both create (POST) and edit (PUT) modes

### 11.4 Menu Item Actions
- `[x]` Edit button → opens MenuItemForm pre-filled
- `[x]` Delete button → ConfirmDialog → DELETE API call
- `[x]` Quick toggle availability (inline switch, instant API call)
- `[x]` Quick toggle bestseller (inline switch)
- `[x]` Reorder items via sort_order field

### 11.5 Category Management (`src/components/admin/CategoryForm.tsx`)
- `[x]` Add new category: name + description
- `[x]` Edit category name/description
- `[x]` Delete category (warn if items exist in it)
- `[x]` Reorder categories via sort_order

---

## Phase 12: Admin — Hero, Slides & About Editor
**Duration:** Day 10 | **Status:** `[x]`

### 12.1 Hero Editor (`src/app/admin/(dashboard)/hero/page.tsx`)
- `[x]` Display current hero section data
- `[x]` Editable fields: heading, subheading, CTA button text
- `[x]` Image upload for background (with current image preview)
- `[x]` Live preview panel showing how hero will look
- `[x]` "Save Changes" button with loading state
- `[x]` Toast on success

### 12.2 Slides Manager (same page or tab)
- `[x]` List all slides with thumbnail, title, status
- `[x]` "Add New Slide" button
- `[x]` Slide form: title, subtitle, image upload, link URL (optional), is_active toggle
- `[x]` Edit existing slides
- `[x]` Delete slide with confirmation
- `[x]` Reorder slides (sort_order)
- `[x]` Active/inactive toggle per slide

### 12.3 About Page Editor (`src/app/admin/(dashboard)/about/page.tsx`)
- `[x]` Text area for brand story (large, multi-line)
- `[x]` Section title field
- `[x]` Image upload for about page photo
- `[x]` USP Highlights editor:
  - List of highlight items (icon + title + description)
  - Add/remove/edit highlights
  - Stored as JSONB array
- `[x]` "Save Changes" button
- `[x]` Preview of how about page will look

---

## Phase 13: Admin — Orders & Reviews Management
**Duration:** Day 11 | **Status:** `[x]`

### 13.1 Orders Page (`src/app/admin/(dashboard)/orders/page.tsx`)
- `[x]` Table view of all orders, newest first
- `[x]` Columns: Order #, Customer, Phone, Items (count), Total, Status, Date, Actions
- `[x]` Status filter tabs: All, Pending, Confirmed, Delivered, Cancelled
- `[x]` Date range filter (today, this week, this month, custom)
- `[x]` Search by customer name or phone
- `[x]` Color-coded status badges (yellow=pending, blue=confirmed, green=delivered, red=cancelled)

### 13.2 Order Detail View (`src/components/admin/OrderDetail.tsx`)
- `[x]` Click order row → expand or open detail panel
- `[x]` Full order info: all items with quantities + prices, total, customer details
- `[x]` Customer address with "copy" button
- `[x]` Customer phone with "call" and "WhatsApp" quick links
- `[x]` Status update dropdown: Pending → Confirmed → Delivered / Cancelled
- `[x]` Notes field (admin can add internal notes)
- `[x]` Timestamp: when ordered, when status changed

### 13.3 Order Actions
- `[x]` Quick status update buttons (Confirm, Mark Delivered)
- `[x]` "Call Customer" → tel: link
- `[x]` "WhatsApp Customer" → wa.me link with order context
- `[x]` Export orders to CSV (date range)
- `[x]` Print order slip (simple print-friendly format)
- `[x]` Delete old orders (bulk delete with date filter)

### 13.5 ⚡ Enhancement: New Order Notification
- `[x]` Browser notification sound when new order arrives (if dashboard is open)
- `[x]` Visual badge on "Orders" sidebar link showing pending count
- `[x]` Auto-refresh orders list every 30 seconds on orders page
- `[x]` Flash/highlight new orders that appeared since last refresh

### 13.4 Reviews Manager (`src/app/admin/(dashboard)/reviews/page.tsx`)
- `[x]` Table of all reviews: customer name, rating, text preview, status, date
- `[x]` Filter tabs: All, Pending Approval, Approved, Featured
- `[x]` Each review row actions:
  - Approve / Reject toggle
  - Feature / Unfeature toggle (featured show on homepage)
  - Delete with confirmation
- `[x]` Click to expand full review text
- `[x]` Bulk approve option (select multiple → approve all)

---

## Phase 14: Admin — Settings & Final Admin Features
**Duration:** Day 12 | **Status:** `[x]`

### 14.1 Site Settings Page (`src/app/admin/(dashboard)/settings/page.tsx`)
- `[x]` Form with all site_settings fields, grouped into sections:

**Brand Info:**
- `[x]` Brand name
- `[x]` Tagline
- `[x]` Description

**Contact:**
- `[x]` Phone number
- `[x]` WhatsApp number (used for order links)
- `[x]` Email address
- `[x]` Address

**Operations:**
- `[x]` Operating hours
- `[x]` Delivery radius info
- `[x]` Minimum order amount (₹)
- `[x]` Delivery charge (₹)
- `[x]` "Accepting Orders" master toggle (on/off)

**Social & Links:**
- `[x]` Instagram URL
- `[x]` Google Maps embed URL

- `[x]` "Save Settings" button with validation
- `[x]` Toast on success
- `[x]` Settings changes reflect immediately on public site

### 14.2 "Accepting Orders" Toggle Effect
- `[x]` When OFF: public website shows "We're currently closed" banner
- `[x]` "Order Now" buttons become disabled
- `[x]` Menu items show "Ordering Paused" state
- `[x]` WhatsApp order flow blocked with message

### 14.3 Admin Profile
- `[x]` Session management (logout from all devices)

### 14.4 ⚡ Enhancement: Logo Management
- [ ] Upload brand logo (used in navbar, favicon, WhatsApp messages)
- [ ] Upload secondary logo / icon version
- [ ] Logo preview in different contexts (navbar, footer, mobile)

### 14.5 ⚡ Enhancement: Announcement Banner
- [ ] Optional top-of-page announcement bar (e.g., "🎉 10% off this week!")
- [ ] Editable text + background color from admin
- [ ] Dismissible by customer (cookie-based)
- [ ] Toggle on/off from settings

---

## Phase 15: Testing, Polish & Deployment
**Duration:** Day 13–15 | **Status:** `[ ]`

### 15.1 Responsive Testing (Day 13)
- [ ] Test all public pages on: iPhone SE, iPhone 14, iPad, Desktop
- [ ] Test admin panel on: tablet and desktop
- [ ] Fix any layout breaks, overflow issues, font scaling
- [ ] Test navbar hamburger menu on all mobile sizes
- [ ] Test cart drawer on mobile
- [ ] Test WhatsApp order flow on actual mobile device

### 15.2 Functional Testing (Day 13)
- [ ] Full order flow: browse → add to cart → fill details → WhatsApp sends → order logged in DB
- [ ] Admin: add menu item with image → appears on public site
- [ ] Admin: edit hero section → changes reflect on homepage
- [ ] Admin: toggle "Accepting Orders" off → public site shows closed
- [ ] Admin: approve review → appears on reviews page + homepage
- [ ] Admin: update settings → footer/contact page updates
- [ ] Test with no data (empty states render properly)
- [ ] Test image upload with various sizes and formats

### 15.3 Performance Optimization (Day 14)
- [ ] Image optimization: next/image with proper sizing and lazy loading
- [ ] Lighthouse audit: target 90+ on Performance, SEO, Accessibility
- [ ] Minimize client-side JavaScript (prefer server components)
- [ ] Add loading.tsx files for route-level loading states
- [ ] Add error.tsx files for graceful error handling
- [ ] Cache Supabase queries where appropriate (revalidation strategy)

### 15.4 SEO Checklist (Day 14)
- [ ] Dynamic page titles from DB (site name + page name)
- [ ] Meta descriptions on all pages
- [ ] Open Graph tags (title, description, image) for social sharing
- [ ] Twitter Card meta tags
- [ ] Structured data (JSON-LD) for Restaurant schema + Menu schema
- [ ] Sitemap generation (`next-sitemap` or manual)
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] Alt text on all images (from DB or auto-generated)

### 15.7 ⚡ Enhancement: PWA Support (Optional but Recommended)
- [ ] Add `manifest.json` (app name, icons, theme color, start URL)
- [ ] "Add to Home Screen" prompt on mobile after 2nd visit
- [ ] App icon on phone home screen for quick access
- [ ] Offline fallback page: "You're offline — please check your connection"
- [ ] This makes the website feel like a native app for repeat customers

### 15.8 ⚡ Enhancement: Analytics Events
- [ ] Track: "Add to Cart" events with item name + price
- [ ] Track: "Order Sent" events with total value
- [ ] Track: "Menu Category" filter clicks
- [ ] Track: "WhatsApp Button" clicks (floating + order)
- [ ] Track: "Review Submitted" events
- [ ] These help understand customer behavior and optimize the menu

### 15.5 Deployment (Day 15)
- [ ] Push code to GitHub (private repository)
- [ ] Create Vercel account and import project
- [ ] Add all environment variables on Vercel:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
- [ ] Deploy and verify build succeeds
- [ ] Test all pages on production URL
- [ ] Connect custom domain (momoza.in or chosen domain)
- [ ] Verify SSL certificate (auto with Vercel)
- [ ] Set up Google Analytics (add tracking ID)
- [ ] Create admin account on production Supabase
- [ ] Seed production database with real menu data + images
- [ ] Final end-to-end test on production

### 15.6 Handover Checklist
- [ ] Record admin panel walkthrough video / guide for client
- [ ] Document: how to add menu items, change hero, manage orders
- [ ] Share admin login credentials with client
- [ ] Set up Supabase email alerts for new orders (optional)
- [ ] Provide GitHub access if client wants future dev

---

## Summary — Phase Checklist

| Phase | Description | Days | Status |
|---|---|---|---|
| 1 | Project Initialization | Day 1 AM | `[ ]` |
| 2 | Supabase Setup | Day 1 PM | `[ ]` |
| 3 | TypeScript Types & Utilities | Day 2 AM | `[ ]` |
| 4 | Design System & Global Layout | Day 2 PM | `[ ]` |
| 5 | Shared Public Components | Day 3 | `[ ]` |
| 6 | Homepage | Day 4 | `[ ]` |
| 7 | Menu Page + Cart + Order Flow | Day 5 | `[ ]` |
| 8 | About, Reviews & Contact Pages | Day 6 | `[ ]` |
| 9 | API Routes (all endpoints) | Day 7 | `[ ]` |
| 10 | Admin Layout & Auth | Day 8 AM | `[ ]` |
| 11 | Admin Dashboard & Menu Manager | Day 8 PM + Day 9 | `[ ]` |
| 12 | Admin Hero, Slides & About Editor | Day 10 | `[ ]` |
| 13 | Admin Orders & Reviews Manager | Day 11 | `[ ]` |
| 14 | Admin Settings & Final Features | Day 12 | `[ ]` |
| 15 | Testing, Polish & Deployment | Day 13–15 | `[ ]` |

**Total: 15 Phases across ~15 working days**

---

*This is a living document. Update status markers as each phase is completed.*
