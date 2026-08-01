# 🥟 Momoza — Complete Digital Strategy & Business Plan

> **Prepared by:** Farhan (Tech & Digital Partner)  
> **Date:** June 20, 2026  
> **Client:** Momoza — Homemade Momos Brand  
> **Status:** Draft — Awaiting Client Review

---

## 1. Understanding the Current Situation

| Aspect | Current State |
|---|---|
| **Product** | Homemade momos — authentic, kitchen-made |
| **Pricing** | ₹45–50 per plate (4 pieces) |
| **Operations** | Home kitchen based |
| **Sales Channel** | Word of mouth, local orders |
| **Digital Presence** | None |
| **Delivery** | Self-managed / local |
| **Goal** | Expand customer base, go digital, increase orders |

### The Core Problem
They have a great product but **zero digital presence**. Customers can't find them, can't order easily, and there's no brand identity. They're also worried about Swiggy/Zomato eating into their margins.

---

## 2. Swiggy/Zomato — Should They Join?

> ⚠️ **Short answer: NOT right now.** Here's why.

### Aggregator Cost Breakdown

| Platform | Commission | GST on Commission | Packaging Mandate | Effective Cut |
|---|---|---|---|---|
| Swiggy | 18–25% | 18% on commission | ₹5–8/order | ~30–35% total |
| Zomato | 18–25% | 18% on commission | ₹5–8/order | ~30–35% total |

**Example on a ₹50 plate:**
- Swiggy/Zomato commission (~25%): **₹12.50**
- GST on commission (18%): **₹2.25**
- Packaging cost: **₹5–8**
- **Net earning per plate: ₹27–30** (from ₹50)

At this price point, aggregators will **destroy margins**. They make sense only when:
- Average order value is ₹200+
- You have a dedicated kitchen staff
- You want brand discovery (not profit)

### Recommendation

| Stage | Platform Strategy |
|---|---|
| **Now (Month 1–6)** | Direct orders only — Website + WhatsApp + Instagram |
| **Later (Month 6–12)** | Consider Zomato/Swiggy ONLY for visibility, not as primary channel |
| **Growth (Year 2+)** | Use aggregators strategically with higher-priced combos/meals |

---

## 3. What I (Farhan) Am Offering

### Services Package

| # | Service | Description | Priority |
|---|---|---|---|
| 1 | **Website Development** | Professional brand website with menu, about, contact & ordering | 🔴 Immediate |
| 2 | **WhatsApp Ordering System** | Customers select items → order sent directly via WhatsApp | 🔴 Immediate |
| 3 | **Brand Identity Setup** | Logo refinement, color palette, consistent visual identity | 🟡 Week 1–2 |
| 4 | **Instagram Page Setup** | Profile setup, content templates, initial posts | 🟡 Week 2–3 |
| 5 | **Google My Business** | Local SEO listing so people can find them on Google Maps | 🟡 Week 2 |
| 6 | **Review Collection System** | Simple system to collect & showcase customer reviews | 🟢 Month 2 |
| 7 | **Customer Database** | Track repeat customers, order history | 🟢 Month 2–3 |
| 8 | **Business Dashboard** | Orders, revenue, best-sellers, analytics | 🔵 Future |

---

## 4. Website Development — Detailed Plan

### 4.1 Website Structure

```
momoza.in (or similar)
├── 🏠 Home / Landing Page
│   ├── Hero section — Brand tagline + food imagery + "Order Now" CTA
│   ├── USP highlights — "Homemade", "Fresh Daily", "₹45 onwards"
│   ├── Featured menu items (top 3-4)
│   └── Customer testimonials/reviews
│
├── 📋 Menu
│   ├── Category-wise display (Veg Momos, Non-Veg, Special, Combos)
│   ├── Each item: Photo, Name, Price, Description
│   ├── "Add to Order" interaction
│   └── Order summary → Send via WhatsApp
│
├── 📖 About Us
│   ├── The family story — why they started
│   ├── The homemade promise
│   ├── Kitchen photos (authenticity)
│   └── Team/family photo
│
├── ⭐ Reviews
│   ├── Customer testimonials
│   ├── Google/Instagram review embeds
│   └── "Leave a Review" CTA
│
├── 📞 Contact
│   ├── WhatsApp direct link
│   ├── Phone number
│   ├── Delivery area/radius info
│   ├── Operating hours
│   └── Location (if applicable)
│
└── 🛒 Order Flow (integrated, not a separate page)
    ├── Select items + quantities from menu
    ├── Review order summary
    ├── Enter name + address + phone
    └── "Send Order on WhatsApp" → opens WhatsApp with pre-filled message
```

### 4.2 WhatsApp Order Flow

This is the **core feature** — no payment gateway needed initially, just direct WhatsApp ordering.

```
Customer Journey:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Customer visits website
         ↓
2. Browses menu → selects items + quantity
         ↓
3. Clicks "Order Now"
         ↓
4. Enters: Name, Phone, Address
         ↓
5. Reviews order summary with total
         ↓
6. Clicks "Send Order via WhatsApp"
         ↓
7. WhatsApp opens with pre-formatted message:
   ┌─────────────────────────────────────────┐
   │ 🥟 *New Order — Momoza*                 │
   │                                         │
   │ *Items:*                                │
   │ • Veg Momos x2 — ₹90                   │
   │ • Chicken Momos x1 — ₹50               │
   │                                         │
   │ *Total: ₹140*                           │
   │                                         │
   │ *Name:* Rahul Sharma                    │
   │ *Phone:* 9876543210                     │
   │ *Address:* B-12, Sector 5, Noida       │
   │                                         │
   │ *Payment:* Cash on Delivery             │
   └─────────────────────────────────────────┘
         ↓
8. Owner receives order on WhatsApp
         ↓
9. Owner confirms with reply
         ↓
10. Prepares & delivers / customer picks up
```

> **Why WhatsApp?**
> - Zero cost for the business
> - Customers already use it daily
> - Personal touch — builds trust
> - No payment gateway fees (COD initially)
> - Owner gets direct customer relationship

### 4.3 Tech Stack

| Component | Technology | Why |
|---|---|---|
| **Frontend** | HTML + CSS + JavaScript | Fast, no hosting complexity, fully custom |
| **Styling** | Custom CSS with modern design | Premium look, animations, responsive |
| **Hosting** | Netlify / Vercel (free tier) | Zero cost, fast CDN, custom domain support |
| **Domain** | momoza.in / momozamomos.com | ₹500–800/year |
| **WhatsApp API** | `wa.me` deep links | Free, no API costs |
| **Analytics** | Google Analytics (free) | Track visitors, popular items |
| **Images** | Optimized WebP | Fast loading on slow connections |

### 4.4 Design Direction

| Element | Direction |
|---|---|
| **Color Palette** | Warm reds, oranges, cream — food-friendly, appetizing |
| **Typography** | Modern, clean — Google Fonts (Outfit / Poppins) |
| **Imagery** | Real food photos — close-ups, steam, freshness |
| **Vibe** | Warm, homemade, trustworthy, premium-local |
| **Mobile First** | 80%+ traffic will be mobile — design for phones first |
| **Animations** | Subtle — food reveals, smooth scrolls, hover effects |

---

## 5. Instagram & Social Media Strategy

### 5.1 Instagram Setup

| Element | Recommendation |
|---|---|
| **Handle** | @momoza.momos or @momoza.official |
| **Bio** | "🥟 Homemade Momos · Fresh Daily · ₹45 onwards · 📍 [City] · Order 👇" |
| **Link in Bio** | Website link (use Linktree or direct) |
| **Highlights** | Menu, Reviews, How We Make, Order Now |
| **Content Style** | Reels-heavy (food reels go viral easily) |

### 5.2 Content Calendar (First Month)

| Week | Content Type | Posts |
|---|---|---|
| **Week 1** | Launch Announcement | 3 posts — teaser, reveal, menu |
| **Week 2** | Behind the Scenes | 2 reels — making process, kitchen setup |
| **Week 3** | Customer Focus | 2 posts — first reviews, customer photos |
| **Week 4** | Engagement | 2 reels + 1 story poll — "which flavor next?" |

### 5.3 Content Ideas That Work for Food

- 🎬 **Reels:** Momos being wrapped (satisfying), steam rising, first bite reaction
- 📸 **Posts:** Flat-lay menu shots, combo offers, festival specials
- 📊 **Stories:** Daily polls, "guess the filling", order-of-the-day
- 💬 **Engagement:** Reply to every comment, repost customer stories

> **Instagram Reels are FREE marketing.** A single viral reel can bring 100+ orders. The food category is one of the easiest to go viral in. This should be a priority alongside the website.

---

## 6. Google My Business (Local SEO)

> This is **FREE** and incredibly powerful. When someone searches "momos near me" on Google, Momoza should show up.

### Setup Checklist

- [ ] Create Google Business Profile
- [ ] Add business name, address, phone, hours
- [ ] Upload 10+ high-quality food photos
- [ ] Add menu with prices
- [ ] Set delivery area
- [ ] Ask early customers to leave Google reviews
- [ ] Post weekly updates (like Instagram but on Google)

---

## 7. Review & Customer Management System

### 7.1 Review Collection

| Method | How |
|---|---|
| **After Delivery** | Send WhatsApp message: "Hey! Hope you enjoyed the momos 🥟 Would you mind leaving us a quick review?" with Google Review link |
| **On Website** | Testimonial section with real customer names |
| **On Instagram** | Repost customer stories/reviews |
| **Incentive** | "Leave a review → Get ₹10 off next order" |

### 7.2 Customer Database (Simple Start)

Start with a **Google Sheet** — no need to overcomplicate:

| Column | Data |
|---|---|
| Customer Name | From WhatsApp orders |
| Phone Number | From WhatsApp |
| Address | From order |
| Order Date | When they ordered |
| Items Ordered | What they got |
| Order Value | Total ₹ |
| Repeat Customer? | Yes/No |
| Notes | Preferences, feedback |

> This Google Sheet becomes the foundation for the future dashboard. No need to build software for this now — just discipline in recording orders.

---

## 8. Pricing & Menu Strategy

### 8.1 Current Menu Recommendations

| Item | Price | Pieces | Strategy |
|---|---|---|---|
| Veg Momos | ₹45 | 4 pcs | Entry-level, hook customers |
| Chicken Momos | ₹50 | 4 pcs | Slightly premium |
| Paneer Momos | ₹55 | 4 pcs | Premium veg option |
| Special/Cheese Momos | ₹60 | 4 pcs | High-margin signature item |
| **Combo: 8 pcs + Chutney** | **₹80–90** | **8 pcs** | **Increase average order value** |
| **Family Pack: 16 pcs** | **₹150–160** | **16 pcs** | **Bulk order, higher revenue** |

> **Key Insight:** The single biggest lever for growth is **increasing average order value**. A ₹50 single plate is hard to sustain with delivery. Combos and family packs naturally push orders to ₹150–200+, making delivery viable and margins healthy.

### 8.2 Delivery Model

| Radius | Strategy |
|---|---|
| **0–3 km** | Free delivery (self-delivery) |
| **3–5 km** | ₹20 delivery charge |
| **5+ km** | Minimum order ₹200 for free delivery, else ₹30–40 |
| **Pickup** | Always available, small discount as incentive |

---

## 9. Phased Growth Roadmap

### Phase 1: Digital Foundation (Month 1–2) 🔴

- [x] Finalize brand name, logo, colors
- [ ] Build & launch website with WhatsApp ordering
- [ ] Set up Instagram page with 10+ initial posts
- [ ] Create Google My Business listing
- [ ] Start collecting customer data in Google Sheets
- [ ] Launch with friends & family, collect first 20 reviews

**Goal:** 5–10 orders/day through website + Instagram

---

### Phase 2: Growth & Engagement (Month 3–4) 🟡

- [ ] Consistent Instagram content (3–4 posts/week)
- [ ] Instagram Reels strategy — target 1 viral reel
- [ ] WhatsApp Broadcast list for repeat customers
- [ ] Introduce combo meals and family packs
- [ ] Partner with local communities/societies for bulk orders
- [ ] Festival special menus (Diwali, Navratri, etc.)

**Goal:** 15–25 orders/day

---

### Phase 3: Optimization & Systems (Month 5–6) 🟢

- [ ] Build simple dashboard (daily orders, revenue, best-sellers)
- [ ] Automated WhatsApp responses (greeting, menu, order confirmation)
- [ ] Customer loyalty program (5th order free, referral discount)
- [ ] Explore cloud kitchen license if volume demands
- [ ] Consider FSSAI license (mandatory for scaling)

**Goal:** 30–50 orders/day, breakeven on kitchen costs

---

### Phase 4: Scale (Month 7–12) 🔵

- [ ] Join Swiggy/Zomato with premium combos (₹200+ items only)
- [ ] Full business dashboard with analytics
- [ ] Hire delivery partner or tie up with Dunzo/Porter
- [ ] Explore second kitchen location or cloud kitchen
- [ ] Online payment integration (UPI on website)
- [ ] Catering & party orders system

**Goal:** 50–100 orders/day, multiple revenue channels

---

## 10. Revenue Projections (Conservative)

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Orders/day | 5 | 15 | 35 | 70 |
| Avg order value | ₹80 | ₹120 | ₹150 | ₹180 |
| Daily revenue | ₹400 | ₹1,800 | ₹5,250 | ₹12,600 |
| Monthly revenue | ₹12,000 | ₹54,000 | ₹1,57,500 | ₹3,78,000 |
| Est. profit margin | 40% | 45% | 50% | 50% |
| **Monthly profit** | **₹4,800** | **₹24,300** | **₹78,750** | **₹1,89,000** |

> These are conservative estimates assuming gradual organic growth. Viral Instagram content or festival seasons can spike these significantly.

---

## 11. Legal & Compliance Checklist

| Item | When | Cost (Approx) |
|---|---|---|
| **FSSAI Registration** | Before Month 3 (mandatory for food business) | ₹100 (basic registration) |
| **FSSAI License** | When revenue > ₹12L/year | ₹2,000–5,000 |
| **GST Registration** | When revenue > ₹20L/year | Free |
| **Trade License** | Check local municipal rules | ₹500–2,000 |
| **Fire Safety** | If setting up cloud kitchen | Varies |

> ⚠️ **FSSAI Registration is legally required** for any food business in India — even home-based ones. Get this done early. It also builds customer trust when displayed on packaging and website.

---

## 12. Budget Summary for Client

### Upfront Costs (What They Need to Spend)

| Item | Cost | Notes |
|---|---|---|
| Domain name | ₹500–800/year | momoza.in or similar |
| Website hosting | ₹0 | Free tier (Netlify/Vercel) |
| FSSAI Registration | ₹100 | Basic registration |
| Packaging (branded) | ₹2,000–3,000 | Initial batch of boxes/stickers |
| Food photography | ₹0–1,000 | DIY with phone or hire once |
| **Total initial investment** | **₹3,000–5,000** | |

### My (Farhan's) Service Fees

| Service | Suggested Pricing | Notes |
|---|---|---|
| Website Development | ₹_____ | One-time |
| Instagram Setup + 10 Posts | ₹_____ | One-time |
| Google My Business Setup | ₹_____ (or bundled) | One-time |
| Monthly Maintenance | ₹_____/month | Updates, content help |
| Future Dashboard | ₹_____ | When they're ready |

> Fill in your pricing above. Consider offering a **bundle deal** for website + Instagram + Google setup to make it a no-brainer for the client.

---

## 13. Immediate Next Steps

| # | Action | Owner | Deadline |
|---|---|---|---|
| 1 | Finalize brand name, logo, and color palette | Farhan + Client | Week 1 |
| 2 | Collect menu items, descriptions, and pricing | Client | Week 1 |
| 3 | Food photography session (phone is fine) | Client | Week 1 |
| 4 | Website development begins | Farhan | Week 1–2 |
| 5 | Instagram page creation | Farhan | Week 2 |
| 6 | Google My Business listing | Farhan | Week 2 |
| 7 | FSSAI Registration application | Client | Week 2 |
| 8 | Website launch + first Instagram posts | Farhan | Week 3 |
| 9 | Soft launch to friends & family | Client | Week 3 |
| 10 | Collect first 10 reviews | Client + Farhan | Week 4 |

---

## 14. Summary — Why This Approach Works

| Traditional Approach | Our Approach |
|---|---|
| Join Swiggy/Zomato → lose 30%+ margins | Direct ordering → keep 100% revenue |
| Depend on platform algorithms | Build own customer base |
| No customer data | Own every customer's contact |
| Generic listing among 1000s | Unique brand website + Instagram |
| High monthly fees | Near-zero recurring costs |
| No control over branding | Full brand control |

> **The strategy is simple: Build a brand, not just a listing. Own the customer relationship. Scale with systems, not with platform dependency.**

---

*This document is confidential and prepared exclusively for Momoza. Do not distribute without permission.*
