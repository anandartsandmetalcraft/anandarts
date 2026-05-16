# ANAND ARTS — MASTER AI INSTRUCTION RULESET
## The Single Source of Truth for Every AI Model on This Project

**Version:** 1.0 · **Date:** April 2026
**Read this entire document before writing a single line of code, design, or config.**
**This document overrides any prior assumptions or defaults you have.**

---

## 🧭 SECTION 0 — HOW TO USE THIS DOCUMENT (READ FIRST)

You are an AI model (Claude, Gemini, GPT, or any future model) working on the **Anand Arts** project.

Before doing anything:
1. Read Section 1 (Project Understanding) completely
2. Identify which layer you are working on (Frontend / Backend / Security / Database)
3. Read ONLY the sections relevant to your current task
4. Check Section 7 (Orchestrator Rules) to understand how your work connects to other layers
5. Follow the rules. Do not improvise architecture. Do not add unrequested features.

**Golden Rule:** Work only on what is explicitly requested in the current prompt. Nothing more.

---

## 📖 SECTION 1 — PROJECT UNDERSTANDING

### 1.1 What is Anand Arts?

Anand Arts is a **premium Indian heritage temple art e-commerce website**.

- **Products:** Brass, bronze, copper, Panchaloha idols; ritual items; wall murals; deepam lamps; custom commissioned pieces
- **Audience:** Devotional buyers, interior decorators, NRI diaspora globally, temple trusts, B2B corporate gifting
- **Business model:** Direct-to-consumer e-commerce + custom commission orders (high-margin)
- **Location:** India (Bengaluru-based, artisans in South India temple towns)
- **Payment:** PhonePe (UPI primary) + cards
- **Shipping:** Shiprocket integration
- **Invoicing:** GST-compliant PDF invoices via Resend + React-PDF

### 1.2 What Makes This Site Different (Competitor Gap — Always Honour These)

Every competitor (BudhShiv, Bhimonee Decor, Prudwi, CopperIdolsIndia, VilakkuKadai) is on generic Shopify/Wix. Anand Arts wins on:

| Gap | What we build |
|-----|--------------|
| No competitor has motion/animation | Smooth GSAP + Framer Motion + Lenis scroll |
| No competitor has brand identity | "Prana & Prakriti" design system — strictly enforced |
| No competitor has custom commissions flow | Dedicated commission form + artisan consultation |
| No competitor has artisan storytelling | Heritage brand narrative section |
| No competitor has a blog | Heritage Journal — SEO authority |
| No competitor has post-purchase tracking UI | Shiprocket timeline component |
| No competitor has B2B GST checkout | Optional GST fields + auto PDF invoice |

**Never remove or simplify these differentiators.**

### 1.3 Tech Stack (Do Not Change Without Explicit Instruction)

```
Frontend:      Next.js 15 (App Router) + TypeScript
Styling:       Tailwind CSS v4 + CSS Custom Properties
Animation:     GSAP 3 + ScrollTrigger + Framer Motion 11
Smooth scroll: Lenis 1.x
Images:        next/image + Cloudinary
Fonts:         next/font/google
State:         Zustand (cart, wishlist)
Forms:         React Hook Form + Zod
Icons:         Lucide React

Backend:       Next.js Server Actions + Route Handlers
Database:      PostgreSQL on Neon (serverless)
ORM:           Prisma
Auth:          NextAuth v5 (Google OAuth + Phone OTP)
Payments:      PhonePe (checksum-based)
Email:         Resend
Invoices:      React-PDF
File storage:  Cloudinary
Cache:         Redis (Upstash serverless)
CDN:           Vercel Edge Network

Deployment:    Vercel (production)
Monitoring:    Vercel Analytics + Sentry
```

### 1.4 Project Phases (Do Not Skip Phases)

```
Phase 1: Foundation — DB schema, security, project setup
Phase 2: Product catalog — listing, search, filter, SEO
Phase 3: Cart & checkout — guest cart, OTP auth, address
Phase 4: Payments — PhonePe, webhook, invoice, stock
Phase 5: Accounts, tracking, Admin CMS
Phase 6: QA, performance, launch
```

### 1.5 Design System (Enforce Absolutely — Never Override)

```css
/* COLORS — Use these exact hex values. Never approximate. */
--color-cream:       #FDF5E6   /* Primary background */
--color-gold:        #B8860B   /* Brand gold, borders, accents */
--color-gold-light:  #F0D080   /* Gold on dark backgrounds */
--color-gold-dim:    #D4A017   /* Hover states */
--color-red:         #8B0000   /* CTA buttons ONLY — use sparingly */
--color-slate:       #2F4F4F   /* Primary text, dark UI elements */
--color-char:        #1A1208   /* Dark section backgrounds */
--color-bronze:      #6B4C1E   /* Secondary text, accents */
--color-card:        #F5EDD8   /* Card surfaces */
--color-border:      #E8D8B8   /* Card/input borders */

/* TYPOGRAPHY — These fonts only. No substitutions. */
--font-display:  'Playfair Display', Georgia, serif   /* H1 headlines */
--font-script:   'Kalam', cursive                     /* H2 subheadings */
--font-body:     'Lora', Georgia, serif               /* Body text */
--font-ui:       'Hind Siliguri', sans-serif          /* Nav, buttons, labels */
```

---

## 🎨 SECTION 2 — FRONTEND RULES

*Apply these rules to every frontend task, every component, every page.*

### 2.1 Core Principles

**RULE F-1: Work only on what is asked.**
If asked to build the Hero section, build only the Hero section. Do not touch the Navbar, Footer, or any other section unless explicitly included in the request.

**RULE F-2: Write in plain, readable TypeScript.**
No clever one-liners. No deeply nested ternaries. Name variables clearly. A junior developer should be able to read your code and understand it without asking questions. Comments where logic is non-obvious.

**RULE F-3: Never collapse or truncate code.**
Output complete, working code. Never write `// ... rest of component` or `// TODO: implement`. If a component is too long for one response, say so and ask which part to start with. A half-built component is worse than no component.

**RULE F-4: Mobile is primary. Desktop is secondary.**
Write mobile styles first in Tailwind (`base → sm → md → lg`). Every component must be tested mentally at 390px width before considering desktop. If it breaks on mobile, it ships broken.

**RULE F-5: Every image uses next/image with Cloudinary.**
Never use `<img>` tags. Always `next/image`. Always provide `alt` text that describes the content meaningfully (not "image" or "photo"). Always include `width`, `height`, and `sizes` props. For product images, use:
```tsx
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

**RULE F-6: Lazy loading is default, eager loading is explicit.**
All images below the fold: `loading="lazy"` (default with next/image).
Only hero images and above-fold images: `priority={true}`.
Never set `priority={true}` on more than 2 images per page.

**RULE F-7: Animations must respect prefers-reduced-motion.**
Every GSAP timeline, every Framer Motion animation, every CSS transition must check:
```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) return // skip all animations
```
This is not optional. It is a legal accessibility requirement in many regions.

**RULE F-8: will-change on animated elements only.**
Add `will-change: transform` only to elements that are actively being animated. Never add it globally or to static elements. It creates GPU layers and wastes VRAM.

**RULE F-9: No layout shift.**
Every image must have explicit dimensions or an aspect ratio box. Text must not reflow on font load. Use `font-display: swap` via next/font. Reserve space for dynamic content (e.g., cart badge).

**RULE F-10: Accessibility is not optional.**
- Every icon button must have `aria-label`
- Every modal must trap focus and close on Escape
- Every form field must have a visible `<label>` or `aria-label`
- Color contrast: minimum 4.5:1 for body text, 3:1 for large text
- Keyboard navigation must work on all interactive elements

### 2.2 Component Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop)/             # Customer-facing routes
│   │   ├── page.tsx        # Homepage
│   │   ├── collections/    # Product listing
│   │   ├── product/[slug]/ # Product detail
│   │   ├── cart/           # Cart
│   │   ├── checkout/       # Checkout flow
│   │   ├── account/        # User dashboard
│   │   └── blog/           # Heritage Journal
│   ├── (admin)/            # Admin CMS routes (protected)
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── orders/
│   └── api/                # Route handlers (webhooks, etc.)
├── components/
│   ├── ui/                 # Primitive UI: Button, Input, Card, Badge
│   ├── layout/             # Navbar, Footer, AnnouncementBar
│   ├── sections/           # Homepage sections (Hero, Collections, etc.)
│   ├── product/            # ProductCard, ProductGrid, ProductDetail
│   ├── cart/               # CartDrawer, CartItem, CartSummary
│   ├── checkout/           # CheckoutForm, AddressForm, OTPModal
│   └── admin/              # AdminTable, ProductForm, OrderDetail
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── redis.ts            # Upstash Redis client
│   ├── auth.ts             # NextAuth config
│   ├── phonepe.ts          # PhonePe SDK wrapper
│   ├── cloudinary.ts       # Image upload helpers
│   └── validations/        # All Zod schemas
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores (cart, wishlist)
├── types/                  # TypeScript type definitions
└── styles/
    └── globals.css         # Design tokens + base styles
```

**RULE F-11: One concern per file.**
A ProductCard component renders a product card. It does not fetch data, does not contain business logic, does not import Prisma. Pass data as props.

**RULE F-12: Server Components are default. Client Components are explicit.**
Add `'use client'` only when you need: `useState`, `useEffect`, event handlers, browser APIs, animation hooks. Everything that can be a Server Component should be.

### 2.3 Animation Rules

**RULE F-13: The Lenis + GSAP setup is sacred. Do not modify it.**
```tsx
// lib/lenis.ts — do not change these values
const lenis = new Lenis({
  lerp: 0.08,           // smoothness — silky, heavy inertia
  smoothWheel: true,
  orientation: 'vertical',
})
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

**RULE F-14: Anti-gravity motion vocabulary.**
| Element type | Required behavior |
|---|---|
| Section headings entering viewport | Slide UP (y: 40 → 0), not down |
| Product cards | Lift on hover: translateY(-8px), transition 0.3s |
| Hero idol/centerpiece | Perpetual float: y oscillates 0 → -14px → 0, 4s loop |
| CTA buttons | Scale 1 → 1.03 on hover, not just color change |
| Page background | Lenis inertia creates natural "floating" feel |
| Decorative particles | Rise upward (incense/ember motion) |

**RULE F-15: ScrollTrigger on every section reveal.**
Every section entering the viewport gets a reveal animation:
```tsx
gsap.fromTo(element, 
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: element, start: "top 80%" }
  }
)
```
Stagger child elements by 0.12s. Never animate all children simultaneously.

**RULE F-16: 3D tilt only on collection cards and product cards.**
```tsx
// On mousemove — decompose mouse position to rotation
const rotateX = (relY - 0.5) * -14
const rotateY = (relX - 0.5) * 14
element.style.transform = 
  `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
// On mouseleave — reset smoothly
element.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
```
Disable on touch devices: check `window.matchMedia('(hover: none)')`.

### 2.4 Performance Rules

**RULE F-17: Core Web Vitals targets.**
| Metric | Target | How |
|---|---|---|
| LCP | < 2.5s | Hero image eager-loaded, Cloudinary optimized |
| CLS | < 0.1 | All images dimensioned, fonts preloaded |
| FID/INP | < 200ms | No blocking scripts, minimal JS on load |
| TTFB | < 800ms | ISR on product pages, edge caching |

**RULE F-18: Product pages use ISR.**
```tsx
// app/product/[slug]/page.tsx
export const revalidate = 3600 // regenerate every 1 hour
```
Never use `dynamic = 'force-dynamic'` on product pages.

**RULE F-19: Bundle size consciousness.**
- Never import an entire library for one utility. (`import { debounce } from 'lodash'` ✗ → write a 3-line debounce ✓)
- GSAP: import only what you use (`import { gsap } from 'gsap'`, `import { ScrollTrigger } from 'gsap/ScrollTrigger'`)
- Check bundle with `@next/bundle-analyzer` before any new heavy dependency

**RULE F-20: Fonts must be preloaded.**
Use `next/font/google` with `display: 'swap'` and `preload: true`. Never load fonts via `<link>` in `<head>`. This eliminates FOUT (Flash of Unstyled Text).

### 2.5 WhatsApp CTA Rules

**RULE F-21: WhatsApp button is always present on customer-facing pages.**
- Fixed position: bottom-right, 24px from edges
- Always on top: `z-index: 9999`
- Pulse animation: green ring expands + fades, 2s loop
- Pre-filled message: `https://wa.me/91XXXXXXXXXX?text=Hi%20Anand%20Arts%2C%20I%20am%20interested%20in...`
- Never remove this for "clean design" reasons. It directly drives revenue.

---

## ⚙️ SECTION 3 — BACKEND RULES

*Apply these rules to every server action, route handler, and API endpoint.*

### 3.1 Core Principles

**RULE B-1: Server Actions for mutations. Route Handlers for webhooks and external callbacks only.**
PhonePe webhook → Route Handler (`/api/webhooks/phonepe`)
Everything else (add to cart, place order, update profile) → Server Actions

**RULE B-2: Every input is validated with Zod before touching the database.**
```typescript
// Pattern for every Server Action
export async function addToCart(formData: unknown) {
  const schema = z.object({ productId: z.string().cuid(), quantity: z.number().int().min(1).max(10) })
  const parsed = schema.safeParse(formData)
  if (!parsed.success) return { error: 'Invalid input', details: parsed.error.flatten() }
  // proceed to DB
}
```
Never trust any input from the client. Not even from logged-in users.

**RULE B-3: Return typed responses from all Server Actions.**
```typescript
type ActionResult<T> = { data: T; error: null } | { data: null; error: string }
```
Never throw unhandled errors to the client. Catch all errors, log them, return a user-safe message.

**RULE B-4: Never expose internal error details to the client.**
```typescript
// WRONG
catch (err) { return { error: err.message } } // might expose DB schema, query, etc.

// RIGHT
catch (err) {
  console.error('[addToCart]', err) // log full error server-side
  return { error: 'Something went wrong. Please try again.' } // safe client message
}
```

**RULE B-5: All database calls go through Prisma. No raw SQL unless unavoidable.**
If raw SQL is needed (e.g., complex analytics query), use `prisma.$queryRaw` with parameterized values only. Never string-interpolate user input into SQL.

### 3.2 Caching Strategy

**RULE B-6: Cache aggressively. Invalidate precisely.**

```typescript
// Caching tiers — use the right tool for each data type

// TIER 1: CDN/Edge Cache (Vercel) — static-ish content
// Product pages: ISR revalidate: 3600 (1 hour)
// Collection pages: ISR revalidate: 1800 (30 min)
// Blog posts: ISR revalidate: 86400 (24 hours)
// Homepage: ISR revalidate: 900 (15 min)

// TIER 2: Redis (Upstash) — dynamic but expensive-to-compute content
// Product list with filters: cache key = hash(filters), TTL = 300s
// Category tree: TTL = 3600s
// Search results: TTL = 60s (searches are user-unique, short TTL)
// Rate limit counters: TTL = 60s (rolling window)

// TIER 3: No cache — always fresh
// Cart contents (user-specific, changes frequently)
// Order status (must be accurate)
// Stock counts displayed as "Only X left" (must be accurate)
// Admin dashboard (must be accurate)
```

**RULE B-7: Redis key naming convention.**
```
anandarts:{resource}:{identifier}:{variant}
Examples:
  anandarts:product:list:category=brass&sort=price_asc
  anandarts:product:cld7x2k3p0001kj08fg2h9xyz (single product by ID)
  anandarts:ratelimit:ip:182.74.xxx.xxx
  anandarts:session:otp:+919876543210
```

**RULE B-8: Invalidate cache on write.**
```typescript
// After any product update in admin
await redis.del(`anandarts:product:${productId}`)
await redis.del('anandarts:product:list:*') // pattern delete for lists
// After stock change
await redis.del(`anandarts:product:${productId}`)
```

### 3.3 Rate Limiting

**RULE B-9: Rate limit every public endpoint. No exceptions.**

```typescript
// lib/ratelimit.ts — Upstash Ratelimit
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

export const rateLimiters = {
  // General API: 100 req/min per IP
  api: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '1 m') }),
  
  // Auth endpoints: 10 attempts/15min per IP (brute force protection)
  auth: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '15 m') }),
  
  // OTP send: 3 OTPs/5min per phone number (prevents SMS abuse)
  otp: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '5 m') }),
  
  // Payment initiation: 5/min per user (fraud prevention)
  payment: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m') }),
  
  // Commission form: 3/hour per IP (prevent spam)
  commission: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h') }),
  
  // Search: 30/min per IP
  search: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m') }),
}

// Usage pattern in every Server Action / Route Handler
export async function withRateLimit(limiter: Ratelimit, identifier: string) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier)
  if (!success) {
    return { 
      error: 'Too many requests. Please wait before trying again.',
      retryAfter: Math.round((reset - Date.now()) / 1000)
    }
  }
  return null // no rate limit hit
}
```

### 3.4 Load & Scale Architecture

**RULE B-10: Design for horizontal scaling from day 1.**

```
Architecture overview:
┌─────────────────────────────────────────────────────┐
│                   Vercel Edge CDN                   │
│         (static assets, ISR pages, edge functions)  │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              Next.js on Vercel                      │
│         (serverless functions — auto-scales)        │
│   Instance 1 │ Instance 2 │ Instance N (horizontal) │
└──────┬────────┴────────────┴────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│                  Redis (Upstash)                    │
│   Session store │ Cache │ Rate limit │ Job queue    │
└──────┬──────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│              PostgreSQL (Neon Serverless)            │
│    Primary (reads+writes) │ Read Replica (reads)     │
└─────────────────────────────────────────────────────┘
```

**RULE B-11: No server-side state in memory.**
Because Vercel runs serverless functions that spin up and down, never store state in module-level variables. All state lives in: Redis (sessions, cache, locks), PostgreSQL (persistent data), or the client (cart in Zustand + localStorage).

**RULE B-12: Database connection pooling is mandatory.**
```typescript
// lib/db.ts — Prisma singleton with connection pooling
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Neon connection pooler URL (port 6543)
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
Always use the **Neon connection pooler URL** (not direct connection) for serverless environments.

**RULE B-13: Background jobs via Vercel Cron or QStash.**
Long operations (invoice PDF generation, email sending, webhook processing) must be non-blocking. Pattern:
1. Webhook arrives → validate → save raw payload → return 200 immediately → queue processing job
2. Cron job processes queue → updates DB → sends email

Never make the user wait for PDF generation or email sending.

### 3.5 Order State Machine

**RULE B-14: Order status transitions are strictly enforced.**

```typescript
type OrderStatus = 'CREATED' | 'PAYMENT_INITIATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED:            ['PAYMENT_INITIATED', 'CANCELLED'],
  PAYMENT_INITIATED:  ['PAID', 'CANCELLED'],
  PAID:               ['PROCESSING', 'REFUNDED'],
  PROCESSING:         ['SHIPPED', 'CANCELLED'],
  SHIPPED:            ['DELIVERED'],
  DELIVERED:          ['REFUNDED'],
  CANCELLED:          [],   // terminal state
  REFUNDED:           [],   // terminal state
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}
// Always call canTransition() before any order status update.
// Throw if invalid transition attempted.
```

### 3.6 Inventory Locking

**RULE B-15: Prevent overselling with optimistic locking.**

```typescript
// When user initiates checkout — lock inventory for 15 minutes
async function lockInventory(productId: string, quantity: number, lockToken: string) {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    })
    if (!product || product.stock < quantity) {
      throw new Error('INSUFFICIENT_STOCK')
    }
    // Decrement stock atomically
    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } }
    })
    // Record the lock with expiry
    await tx.inventoryLock.create({
      data: { productId, quantity, lockToken, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }
    })
  })
}

// Cron job every 5 minutes: release expired locks
// SELECT * FROM inventory_locks WHERE expires_at < NOW()
// For each: increment stock back, delete lock
```

---

## 🗄️ SECTION 4 — DATABASE RULES

### 4.1 Schema Design Principles

**RULE D-1: Every table has these base columns.**
```sql
id         TEXT PRIMARY KEY DEFAULT gen_random_uuid() -- cuid2 from application
createdAt  TIMESTAMPTZ NOT NULL DEFAULT NOW()
updatedAt  TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**RULE D-2: Never delete. Soft-delete instead.**
```sql
deletedAt  TIMESTAMPTZ NULL DEFAULT NULL
-- Query: WHERE deleted_at IS NULL
-- "Delete": UPDATE SET deleted_at = NOW()
```
This preserves order history, audit trails, and makes accidental deletes recoverable.

**RULE D-3: Full schema.**

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  phone         String?   @unique
  email         String?   @unique
  name          String?
  role          Role      @default(CUSTOMER)
  googleId      String?   @unique
  addresses     Address[]
  orders        Order[]
  wishlist      WishlistItem[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  @@index([phone])
  @@index([email])
}

enum Role { CUSTOMER ADMIN }

model Product {
  id            String         @id @default(cuid())
  slug          String         @unique
  name          String
  description   String
  material      Material
  deity         String?
  origin        String?        // e.g., "Swamimalai, Tamil Nadu"
  height_inches Float?
  weight_grams  Int?
  hsnCode       String         // Required for GST invoice
  price         Int            // Store in paise (₹1 = 100 paise)
  comparePrice  Int?           // Original price for discount display
  gstPercent    Float          @default(12)
  stock         Int            @default(0)
  images        ProductImage[]
  tags          String[]
  isFeatured    Boolean        @default(false)
  isPublished   Boolean        @default(false)
  orderItems    OrderItem[]
  inventoryLocks InventoryLock[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  deletedAt     DateTime?
  
  @@index([slug])
  @@index([material])
  @@index([isPublished, isFeatured])
  @@index([price])
  @@index([createdAt DESC])  // New arrivals query
}

enum Material { BRASS BRONZE COPPER PANCHALOHA WOOD STONE OTHER }

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  cloudinaryId String
  url         String
  alt         String
  position    Int      @default(0)  // Sort order
  
  @@index([productId])
}

model Address {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  phone       String
  line1       String
  line2       String?
  city        String
  state       String
  pincode     String
  isDefault   Boolean  @default(false)
  gstNumber   String?  // Optional for B2B
  gstName     String?
  orders      Order[]
  
  @@index([userId])
}

model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique  // Human-readable: AA-2025-00001
  userId        String?
  user          User?       @relation(fields: [userId], references: [id])
  addressId     String
  address       Address     @relation(fields: [addressId], references: [id])
  items         OrderItem[]
  status        OrderStatus @default(CREATED)
  subtotal      Int         // paise
  gstAmount     Int         // paise
  shippingCost  Int         // paise
  total         Int         // paise
  payment       Payment?
  trackingId    String?     // Shiprocket tracking ID
  shiprocketOrderId String?
  invoiceUrl    String?     // Cloudinary URL of generated PDF
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt DESC])
  @@index([orderNumber])
}

enum OrderStatus { CREATED PAYMENT_INITIATED PAID PROCESSING SHIPPED DELIVERED CANCELLED REFUNDED }

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  name        String   // Snapshot at purchase time
  price       Int      // Snapshot at purchase time (paise)
  quantity    Int
  gstPercent  Float    // Snapshot
  
  @@index([orderId])
  @@index([productId])
}

model Payment {
  id                String        @id @default(cuid())
  orderId           String        @unique
  order             Order         @relation(fields: [orderId], references: [id])
  merchantOrderId   String        @unique  // Our internal ID sent to PhonePe
  phonePeTransactionId String?    @unique  // PhonePe's transaction ID
  amount            Int           // paise
  status            PaymentStatus @default(PENDING)
  method            String?       // UPI, CARD, etc.
  webhookPayload    Json?         // Raw PhonePe webhook — for audit
  webhookReceivedAt DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([merchantOrderId])
  @@index([status])
}

enum PaymentStatus { PENDING INITIATED SUCCESS FAILED REFUNDED }

model InventoryLock {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  lockToken   String   @unique  // Session/cart identifier
  expiresAt   DateTime
  
  @@index([productId])
  @@index([expiresAt])  // For cron cleanup query
}

model WebhookLog {
  id          String   @id @default(cuid())
  source      String   // 'phonepe' | 'shiprocket'
  event       String
  payload     Json
  processed   Boolean  @default(false)
  processedAt DateTime?
  error       String?
  createdAt   DateTime @default(now())
  
  @@index([source, processed])
  @@index([createdAt DESC])
}

model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     String   // Markdown
  coverImage  String
  category    String
  readTime    Int      // minutes
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([isPublished, publishedAt DESC])
}

model Commission {
  id            String           @id @default(cuid())
  name          String
  phone         String
  email         String?
  deity         String
  sizeRange     String
  material      String
  budget        String
  description   String
  referenceUrls String[]
  status        CommissionStatus @default(ENQUIRY)
  adminNotes    String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  
  @@index([status])
  @@index([createdAt DESC])
}

enum CommissionStatus { ENQUIRY REVIEWING QUOTED ACCEPTED IN_PROGRESS COMPLETED CANCELLED }
```

### 4.2 Query Optimization Rules

**RULE D-4: Every foreign key has an index. Every filter field has an index.**
Before any new query: check if the WHERE clause fields are indexed. If not, add the index. Unindexed queries on large tables are silent performance killers.

**RULE D-5: Select only the columns you need.**
```typescript
// WRONG — fetches all columns including large description, content fields
const products = await prisma.product.findMany()

// RIGHT — fetch only what the product card needs
const products = await prisma.product.findMany({
  select: {
    id: true, slug: true, name: true, price: true, stock: true, material: true,
    images: { select: { url: true, alt: true }, take: 1, orderBy: { position: 'asc' } }
  }
})
```

**RULE D-6: Use cursor-based pagination for product lists, not offset.**
```typescript
// WRONG — offset pagination degrades with large datasets
findMany({ skip: page * pageSize, take: pageSize })

// RIGHT — cursor pagination stays fast regardless of dataset size
findMany({ take: 20, cursor: lastId ? { id: lastId } : undefined, skip: lastId ? 1 : 0 })
```

**RULE D-7: Prices are always stored and computed in paise (integer).**
Never use floating point for money. ₹12,800 is stored as `1280000`. Display by dividing by 100.
```typescript
export const formatPrice = (paise: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100)
```

**RULE D-8: Analytics queries use aggregations, not application-level loops.**
```sql
-- WRONG in application code: fetch all orders, loop and sum
-- RIGHT: let PostgreSQL do the heavy lifting
SELECT 
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) as orders,
  SUM(total) as revenue
FROM orders
WHERE status = 'PAID' AND created_at > NOW() - INTERVAL '30 days'
GROUP BY day ORDER BY day;
```

---

## 🔐 SECTION 5 — SECURITY RULES

**These rules are non-negotiable. Never skip, simplify, or defer security rules.**

### 5.1 Authentication

**RULE S-1: Authentication is via NextAuth v5 only.**
Two providers:
1. **Google OAuth** — for users who prefer Google sign-in
2. **Phone OTP** — primary for Indian users (mobile-first market)

Never roll custom authentication. Never store plain passwords. Never use JWTs stored in localStorage.

**RULE S-2: Session strategy is database sessions (not JWT).**
```typescript
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' }, // NOT 'jwt'
  // ...
})
```
Database sessions allow immediate revocation. JWT sessions cannot be revoked until expiry.

**RULE S-3: OTP security implementation.**
```typescript
async function sendOTP(phone: string) {
  // 1. Rate limit: max 3 OTPs per phone per 5 minutes
  const limit = await rateLimiters.otp.limit(phone)
  if (!limit.success) return { error: 'Too many OTP requests. Try in 5 minutes.' }
  
  // 2. Generate cryptographically random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString()
  
  // 3. Hash OTP before storing (never store plain OTP)
  const otpHash = await bcrypt.hash(otp, 10)
  
  // 4. Store hash in Redis with 10-minute TTL
  await redis.setex(`anandarts:otp:${phone}`, 600, otpHash)
  
  // 5. Send via SMS provider (Twilio / Fast2SMS)
  await smsProvider.send(phone, `Your Anand Arts OTP is: ${otp}. Valid for 10 minutes.`)
  
  return { success: true }
}

async function verifyOTP(phone: string, otp: string) {
  const stored = await redis.get(`anandarts:otp:${phone}`)
  if (!stored) return { error: 'OTP expired or not requested' }
  
  const valid = await bcrypt.compare(otp, stored)
  if (!valid) return { error: 'Invalid OTP' }
  
  // Delete OTP after successful verification (one-time use)
  await redis.del(`anandarts:otp:${phone}`)
  
  return { success: true }
}
```

**RULE S-4: Admin routes require role check on every request.**
```typescript
// Middleware pattern for admin routes
// middleware.ts
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth()
    if (!session?.user) return NextResponse.redirect('/login')
    if (session.user.role !== 'ADMIN') return NextResponse.redirect('/') // 403
  }
}
```
Never rely on client-side role checks alone. Always verify on server.

### 5.2 Payment Security

**RULE S-5: PhonePe checksum verification is mandatory on every webhook.**
```typescript
// Route Handler: /api/webhooks/phonepe
export async function POST(request: Request) {
  // 1. Get raw body for signature verification
  const rawBody = await request.text()
  const signature = request.headers.get('x-verify')
  
  // 2. Verify checksum before processing anything
  const expectedSignature = createHash('sha256')
    .update(rawBody + process.env.PHONEPE_SALT_KEY)
    .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX
  
  if (signature !== expectedSignature) {
    console.error('[PhonePe Webhook] Invalid signature')
    return new Response('Unauthorized', { status: 401 })
  }
  
  // 3. Parse payload only after verification
  const payload = JSON.parse(rawBody)
  
  // 4. Idempotency check — have we processed this transaction before?
  const existing = await prisma.payment.findUnique({
    where: { phonePeTransactionId: payload.data.transactionId }
  })
  if (existing?.status === 'SUCCESS') {
    return new Response('Already processed', { status: 200 }) // Return 200 to stop retries
  }
  
  // 5. Log raw webhook before processing
  await prisma.webhookLog.create({ data: { source: 'phonepe', event: payload.code, payload } })
  
  // 6. Process asynchronously — return 200 to PhonePe immediately
  processPaymentWebhook(payload).catch(console.error) // non-blocking
  return new Response('OK', { status: 200 })
}
```

**RULE S-6: Payment amount is always verified server-side.**
Never trust the amount sent in a webhook. Always cross-reference with your database order total:
```typescript
if (webhookAmount !== order.total) {
  // Possible amount tampering — DO NOT mark as paid
  await alertAdminOfSuspiciousPayment(orderId, webhookAmount, order.total)
  return
}
```

**RULE S-7: Payment credentials never in frontend code.**
`PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY` — server-side only environment variables. They must never appear in:
- Any `'use client'` component
- Any file imported by a client component
- Any API response

### 5.3 Data Security

**RULE S-8: HTTP Security Headers — required in next.config.js.**
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: buildCSP() }, // see below
]
```

**RULE S-9: Environment variables hygiene.**
```
# .env.local — NEVER commit this file
DATABASE_URL=postgresql://...         # Neon connection pooler
DIRECT_URL=postgresql://...           # Neon direct URL (for migrations only)
REDIS_URL=redis://...                 # Upstash
NEXTAUTH_SECRET=...                   # 32+ char random string
PHONEPE_MERCHANT_ID=...
PHONEPE_SALT_KEY=...
PHONEPE_SALT_INDEX=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...            # Server-only
RESEND_API_KEY=...
```
`NEXT_PUBLIC_` prefix = visible in browser. Only non-sensitive config gets this prefix. (e.g., `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is OK; `NEXT_PUBLIC_PHONEPE_SALT_KEY` is a security breach.)

**RULE S-10: Input sanitization for user-generated content.**
Blog comments, commission descriptions, review text — sanitize with `DOMPurify` before rendering. Never render raw HTML from user input via `dangerouslySetInnerHTML` without sanitization.

**RULE S-11: File uploads are validated and sanitized.**
For commission reference image uploads via Cloudinary:
```typescript
// Allowed MIME types only
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

if (!ALLOWED_TYPES.includes(file.type)) return { error: 'Invalid file type' }
if (file.size > MAX_SIZE_BYTES) return { error: 'File too large (max 10MB)' }
// Upload to Cloudinary with folder restriction
```

**RULE S-12: CSRF protection via Next.js Server Actions built-in.**
Server Actions have built-in CSRF protection (origin checking). Never use Route Handlers for mutations — use Server Actions. For Route Handlers that accept POST (webhooks), validate signature headers instead.

---

## 🤖 SECTION 6 — SEO & CONTENT RULES

**RULE SEO-1: Every product page has unique metadata.**
```typescript
// app/product/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return {
    title: `${product.name} | ${product.material} | Anand Arts`,
    description: `Buy authentic ${product.material} ${product.name}. Handcrafted in ${product.origin}. ${product.height_inches}" tall. GST invoice included. Free shipping above ₹999.`,
    openGraph: {
      title: `${product.name} — Anand Arts`,
      images: [{ url: product.images[0].url, width: 800, height: 800, alt: product.images[0].alt }],
    },
  }
}
```

**RULE SEO-2: Schema.org structured data on product pages.**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.images.map(i => i.url),
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "price": product.price / 100,
    "priceCurrency": "INR",
    "availability": product.stock > 0 ? "InStock" : "OutOfStock",
    "seller": { "@type": "Organization", "name": "Anand Arts" }
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "48" }
}) }} />
```

**RULE SEO-3: sitemap.xml is auto-generated.**
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts()
  const posts = await getPublishedPosts()
  return [
    { url: 'https://anandarts.in', priority: 1.0, changeFrequency: 'daily' },
    { url: 'https://anandarts.in/collections', priority: 0.9 },
    ...products.map(p => ({ url: `https://anandarts.in/product/${p.slug}`, priority: 0.8, changeFrequency: 'weekly' })),
    ...posts.map(p => ({ url: `https://anandarts.in/blog/${p.slug}`, priority: 0.7 })),
  ]
}
```

---

## 🎼 SECTION 7 — ORCHESTRATOR RULES

*These rules define how AI models coordinate across layers. Any AI model that reads this document must follow these coordination rules.*

### 7.1 The Orchestrator Role

When working on this project, there is always one Orchestrator and one or more Executor models.

**Orchestrator responsibilities:**
- Reads this entire document before each session
- Identifies which section/layer the current task belongs to
- Breaks the task into atomic sub-tasks
- Assigns rules from this document to each sub-task
- Reviews output from Executors for rule compliance
- Flags any deviation from the design system, security rules, or architecture
- Maintains the task log (Section 7.3)

**Executor responsibilities:**
- Reads the Project Understanding (Section 1) and their relevant layer sections
- Works only on the assigned sub-task
- References rule numbers in their output (e.g., "Applied F-5 for image optimization")
- Flags any ambiguity before starting (not after)
- Never makes architectural decisions — escalate to Orchestrator

### 7.2 Task Handoff Protocol

Every task handed between models must include:

```
TASK HANDOFF PACKAGE
=====================
Task ID:         [e.g., TASK-042]
Layer:           [Frontend / Backend / Database / Security / Design]
Phase:           [1-6 from Section 1.4]
Requested by:    [User / Orchestrator]
Description:     [Exact what needs to be built]
Input:           [What exists already that this task depends on]
Output expected: [What files/code/config should be produced]
Rules to apply:  [List rule numbers from this document: F-1, B-6, S-5, etc.]
Do NOT touch:    [Files/components that must not be modified]
Definition of done: [How to know the task is complete]
```

### 7.3 Task Log Template

Maintain this log at the end of every session. Paste into new session for continuity.

```
ANAND ARTS — SESSION LOG
========================
Date: ___________
Phase active: ___________

COMPLETED TASKS:
[ ] TASK-001 | Schema design | DB layer | Phase 1 | ✅ Done
[ ] TASK-002 | Next.js project setup | Frontend | Phase 1 | ✅ Done

IN PROGRESS:
[ ] TASK-003 | Product list page | Frontend | Phase 2 | 🔄 Hero done, grid pending

BLOCKED:
[ ] TASK-004 | PhonePe integration | Backend | Phase 4 | ❌ Waiting for merchant credentials

NEXT UP:
[ ] TASK-005 | Product detail page | Frontend | Phase 2
[ ] TASK-006 | Search + filter API | Backend | Phase 2

DECISIONS MADE THIS SESSION:
- Chose cursor pagination over offset for product listing (Rule D-6)
- Used ISR revalidate:3600 for product pages (Rule F-18, B-6)

OPEN QUESTIONS:
- PhonePe sandbox credentials needed from client
- Confirm GST registration number for invoice template
```

### 7.4 Quality Gates (Orchestrator Checks)

Before any code is considered "done", Orchestrator verifies:

**Frontend gate:**
- [ ] Mobile layout tested at 390px (Rule F-4)
- [ ] All images use next/image (Rule F-5)
- [ ] `prefers-reduced-motion` handled (Rule F-7)
- [ ] All interactive elements have `aria-label` (Rule F-10)
- [ ] No `'use client'` without justification (Rule F-12)
- [ ] Animations follow anti-gravity vocabulary (Rule F-14)
- [ ] Design tokens used from CSS variables (Section 1.5)

**Backend gate:**
- [ ] All inputs validated with Zod (Rule B-2)
- [ ] Rate limiting applied (Rule B-9)
- [ ] No secrets in client-accessible code (Rule S-7)
- [ ] Error messages are user-safe (Rule B-4)
- [ ] State machine respected for order updates (Rule B-14)

**Database gate:**
- [ ] All WHERE clause fields are indexed (Rule D-4)
- [ ] Select only needed columns (Rule D-5)
- [ ] Prices in paise (Rule D-7)
- [ ] Soft delete used (Rule D-2)

**Security gate:**
- [ ] Security headers configured (Rule S-8)
- [ ] No secrets in `.env.local` committed to git (Rule S-9)
- [ ] PhonePe webhook signature verified (Rule S-5)
- [ ] Payment amount cross-referenced (Rule S-6)
- [ ] OTP hashed before storage (Rule S-3)

---

## 🚫 SECTION 8 — WHAT NEVER TO DO

Read this before every task.

| Never | Because |
|-------|---------|
| Use `<img>` instead of `next/image` | No optimization, CLS issues |
| Store prices as floats | Floating point errors in currency math |
| Trust client-provided prices/totals | Payment fraud vector |
| Skip Zod validation on any input | SQL injection, type confusion, app crashes |
| Return raw DB errors to client | Leaks schema, table names, internal details |
| Use `role="admin"` from client session alone | Easy to spoof — always verify server-side |
| Set `priority={true}` on more than 2 images/page | Causes bandwidth waste, hurts LCP for other resources |
| Import entire lodash/moment etc. | Adds 100KB+ to bundle |
| Use offset pagination | Degrades at scale, causes "missing/duplicate" items on concurrent inserts |
| Skip `will-change` cleanup | GPU memory leak over long sessions |
| Inline `style=` for colors/fonts | Breaks design system, impossible to maintain |
| Hardcode ₹ amounts or tax rates | Changes over time, must come from DB/config |
| Use `console.log` in production | Performance cost + potential data leak in logs |
| Skip webhook idempotency check | Order created twice, stock depleted twice |
| Use `any` in TypeScript | Type safety is the point — use `unknown` + type narrowing |
| Modify `lib/lenis.ts` animation values | The smooth scroll feel is intentional, tuned |
| Change the color palette | Exact hex values in Section 1.5 are non-negotiable |
| Change the font stack | The three-font system is the brand identity |
| Build unrequested features | Scope creep delays the actual requested work |
| Collapse/truncate code in output | Incomplete code shipped = broken production |

---

## 📋 SECTION 9 — QUICK REFERENCE CARD

*For models with limited context — start here, then read relevant sections.*

```
PROJECT:   Anand Arts — Premium Indian temple art e-commerce
STACK:     Next.js 15, TypeScript, Tailwind, GSAP, Prisma, PostgreSQL, Redis, PhonePe
PHASES:    1(Foundation) 2(Products) 3(Cart) 4(Payments) 5(CMS) 6(Launch)

COLORS:    Cream #FDF5E6 | Gold #B8860B | Red #8B0000 | Slate #2F4F4F | Dark #1A1208
FONTS:     Playfair Display (H1) | Kalam (H2) | Lora (body) | Hind Siliguri (UI)

TOP 5 FRONTEND RULES:
  F-1  Work only on what is asked
  F-3  Never collapse or truncate code
  F-4  Mobile first (390px)
  F-5  Always next/image with alt
  F-7  Always respect prefers-reduced-motion

TOP 5 BACKEND RULES:
  B-1  Server Actions for mutations
  B-2  Zod validation on ALL inputs
  B-4  Never expose internal errors to client
  B-9  Rate limit every public endpoint
  B-14 Order state machine — enforce transitions

TOP 5 SECURITY RULES:
  S-2  Database sessions, not JWT
  S-5  PhonePe: verify checksum before processing
  S-6  Verify payment amount server-side
  S-8  Security headers in next.config.js
  S-9  No secrets with NEXT_PUBLIC_ prefix

TOP 5 DATABASE RULES:
  D-2  Soft delete always
  D-4  Index every foreign key and filter field
  D-5  Select only needed columns
  D-6  Cursor pagination, not offset
  D-7  Prices in paise (integers only)

WHEN IN DOUBT:
  - Read Section 1 to re-anchor on the project
  - Check Section 8 (Never Do list) before building anything
  - Use the Task Handoff Package (Section 7.2) to context-switch between models
```

---

*ANAND ARTS AI RULES v1.0 — April 2026*
*Prepared by: Project Orchestrator*
*This document is the single source of truth. When in conflict with any other instruction, this document wins.*
