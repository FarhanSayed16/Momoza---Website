# Phase 5–10 Code Audit Report

> Audited on 2026-06-21 by reviewing Master Plan specs against actual implementation files.

---

## 🔴 Critical Bugs (Will crash or return wrong data)

### 1. `is_published` vs `is_approved` Column Mismatch
**Severity:** 🔴 CRITICAL — Reviews will NEVER appear on the public site  
**Affected Files:**
- `src/app/(public)/reviews/page.tsx` → line 21: `.eq('is_published', true)`
- `src/app/(public)/page.tsx` → line 66: `.eq('is_published', true)`

**Problem:** The database schema (`supabase/seed.sql`) defines `reviews.is_approved`, but the public pages query for `is_published` — a column that does not exist. Supabase will silently return zero rows or throw an error.

**Fix:** Change `.eq('is_published', true)` → `.eq('is_approved', true)` in both files.

---

### 2. Homepage `generateMetadata` queries `store_name` — column is `brand_name`
**Severity:** 🔴 CRITICAL — SEO title will always show fallback  
**Affected File:** `src/app/(public)/page.tsx` → lines 18, 22

**Problem:** The metadata function queries `.select('store_name, tagline')` and reads `settings?.store_name`, but the actual DB column is `brand_name`. The query will fail or return null for that field.

**Fix:** Change `store_name` → `brand_name` in the select and the template literal.

---

### 3. Public Orders API missing `success` wrapper — inconsistent response
**Severity:** 🟡 MEDIUM — Admin dashboard expects `{ success, data }` but public API returns `{ data }`  
**Affected File:** `src/app/api/orders/route.ts`

**Problem:** The public order POST returns `{ data }` while all admin APIs use `{ success: true, data }`. This isn't a crash bug since the public OrderForm reads the raw response, but it's inconsistent and fragile.

**Fix:** Use the `successResponse` utility from `api-response.ts`.

---

### 4. Public Reviews API missing `success` wrapper — same issue
**Severity:** 🟡 MEDIUM  
**Affected File:** `src/app/api/reviews/route.ts`

**Fix:** Use the `successResponse` utility.

---

## 🟡 Functional Gaps (Missing features marked as done)

### 5. Carousel (Phase 6.6) — Marked `[ ]` in Plan but Implemented
**Status:** The Carousel component exists and works (Embla-based, auto-play, dots, arrows). But the plan still shows `[ ]` checkboxes. The Carousel IS on the homepage.

**Fix:** Mark Phase 6.6 checkboxes as `[x]` in Master Plan.

---

### 6. `CategoryTabs` component missing as standalone file
**Severity:** 🟢 LOW  
**Phase 7.2** specifies `src/components/public/CategoryTabs.tsx` but the category filtering is embedded directly inside `MenuGrid.tsx`.

**Impact:** No functional issue — it works correctly. Just a naming/structure deviation from the plan.

---

### 7. No `error.tsx` files for graceful error boundaries
**Severity:** 🟡 MEDIUM  
**Phase 15.3** mentions this, but it's also a gap since Phase 5: no `error.tsx` exists anywhere under `(public)` or `admin`.

**Impact:** Uncaught errors will show the default Next.js error page instead of a branded one.

---

## 🟠 API Security & Data Integrity Issues

### 8. Public `POST /api/orders` has no input validation
**Severity:** 🟠 HIGH  
**Affected File:** `src/app/api/orders/route.ts`

**Problem:** The route blindly inserts whatever the client sends. No validation for:
- `customer_name` being non-empty
- `customer_phone` format (10 digits)
- `total_amount` being a positive number
- `items` being a non-empty array

**Fix:** Add server-side validation before insert.

---

### 9. Public `POST /api/reviews` has no rate limiting
**Severity:** 🟡 MEDIUM  
**Phase 8.3** specifies "1 review per phone per day" but no such check exists in `src/app/api/reviews/route.ts`.

**Impact:** A user can spam unlimited reviews.

**Fix:** Add a Supabase query checking for existing reviews with the same phone from today before inserting.

---

### 10. Admin API `PUT` routes accept raw body — no field whitelisting
**Severity:** 🟠 HIGH  
**Affected Files:** All admin `[id]/route.ts` (menu, orders, reviews, slides, categories, hero, settings, about)

**Problem:** Every `PUT` handler does `.update(body)` — it sends the entire client-provided JSON directly to Supabase. A crafted request could update fields like `id`, `created_at`, or inject unexpected columns.

**Fix:** Pick only the expected fields from `body` before passing to `.update()`.

---

## 🟢 Minor Issues & Polish

### 11. `Navbar.tsx` — `hero/page.tsx` sidebar link is `/admin/slides` but route is `/admin/hero`
**Severity:** 🟢 LOW  
**Affected File:** `src/app/admin/(dashboard)/layout.tsx` → line 24

**Problem:** The sidebar nav link says `{ name: 'Hero & Slides', href: '/admin/slides' }` but the actual page route is `/admin/hero`. Clicking "Hero & Slides" in the sidebar will 404.

**Fix:** Change `href: '/admin/slides'` → `href: '/admin/hero'`.

---

### 12. Homepage metadata doesn't use `description` from DB
**Severity:** 🟢 LOW  
**Problem:** The homepage `generateMetadata` hardcodes the description string instead of reading `settings.description` from the database.

---

### 13. `CategoryCard` uses hardcoded placeholder images
**Severity:** 🟢 LOW  
**Affected File:** `src/app/(public)/page.tsx` → line 90

**Problem:** `imageUrl` is hardcoded to 3 placeholder paths based on array index. These images may not exist.

---

### 14. `Carousel` has `noPadding` prop on `Section` but Section may not support it
**Severity:** 🟢 LOW — needs verification of Section component props.

---

## 📊 Summary Table

| # | Severity | Phase | Issue | Status |
|---|----------|-------|-------|--------|
| 1 | 🔴 CRITICAL | 6,8 | `is_published` → `is_approved` mismatch | Needs fix |
| 2 | 🔴 CRITICAL | 6 | `store_name` → `brand_name` in metadata | Needs fix |
| 3 | 🟡 MEDIUM | 9 | Public orders API missing `success` wrapper | Needs fix |
| 4 | 🟡 MEDIUM | 9 | Public reviews API missing `success` wrapper | Needs fix |
| 5 | 🟢 INFO | 6 | Carousel plan checkboxes still unchecked | Needs update |
| 6 | 🟢 LOW | 7 | CategoryTabs naming differs from plan | Acceptable |
| 7 | 🟡 MEDIUM | 5 | No `error.tsx` error boundaries | Needs creation |
| 8 | 🟠 HIGH | 9 | Orders API has no server validation | Needs fix |
| 9 | 🟡 MEDIUM | 8 | Reviews API has no rate limiting | Needs fix |
| 10 | 🟠 HIGH | 9 | Admin PUT routes pass raw body unsanitized | Low priority |
| 11 | 🟢 LOW | 10 | Sidebar hero link points to wrong route | Needs fix |
| 12 | 🟢 LOW | 6 | Homepage meta description hardcoded | Needs fix |
| 13 | 🟢 LOW | 6 | CategoryCard placeholder images hardcoded | Acceptable |
| 14 | 🟢 LOW | 6 | Section `noPadding` prop usage | Needs verify |
