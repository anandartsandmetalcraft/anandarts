Anand Arts Website + Admin
CMS — PRD & Task List
1. Overview
Build a high-performance e-commerce website for Anand Arts
(heritage/temple-art style) with an internal Admin CMS to manage products,
orders, and basic analytics.
2. Goals
Increase online discovery and conversion for products.
Provide a simple, secure admin panel for day-to-day operations.
Ensure fast load times and SEO-friendly pages.
3. Non-goals (Phase 1)
Marketplace/multi-vendor support
Advanced CRM features
Complex discounting engine (beyond basic coupons, if any)
4. Users & user stories
4.1 Customer (Shopper)
Browse products quickly and trust the brand.
Search and filter products.
Add products to cart and checkout smoothly.
Receive payment confirmation and invoice.
Track order delivery.
4.2 Admin (Store operator)
Log in securely.
Add/edit/remove products and images.
Anand Arts Website + Admin CMS — PRD & Task List 1
View and update order status (confirmed/delivered/cancelled).
View basic sales analytics.
Track shipments via tracking API.
5. Scope (information architecture)
5.1 Frontend pages
Home
Product listing / catalog
Search
New arrivals
Top sellers
Filter & sort
Product cards
About
Contact
Location
Social links
Subscribe
Contact number
Shop timings
Customer Care
Terms & Conditions
Shipping terms
Payment terms
Privacy policy
Cart
Favorites (optional)
Items in cart
Anand Arts Website + Admin CMS — PRD & Task List 2
Checkout
Payment
5.2 Admin (CMS)
Login (credentials-based)
Main dashboard
Charts
Product quick stats
Order quick stats
Product CRUD
Order management
View order details
Status: confirmed / delivered / cancelled
Package tracking (via API)
Analytics (simple charts/graphs of sales)
6. Brand & UI requirements
6.1 Color palette ("Prana & Prakriti")
Primary: Sandalwood Cream (#FDF5E6)
Secondary: Deepam Gold (#B8860B)
Accent CTA (sparingly): Kunkum Red (#8B0000)
Text/detail: Temple Stone Grey (#2F4F4F)
6.2 Typography scale
H1: Playfair Display (48–60 desktop / 32–40 mobile)
H2: Kalam (32–36 desktop / 24–28 mobile)
H3 + body: Lora (24 / 18 desktop; 20 / 16 mobile)
Buttons: Hind 16 (semi-bold)
Anand Arts Website + Admin CMS — PRD & Task List 3
7. Functional requirements
7.1 Catalog & product experience
Product list must support search, filters, and sort.
Product cards must show key info at a glance.
Catalog pages must be SEO-friendly.
7.2 Cart & checkout
Guest cart supported (local storage).
Login/OTP required at payment step.
Shipping address collected.
GST details optional (B2B).
7.3 Payments
Cashfree integration for UPI, cards, and netbanking.
Payment status updated via webhook.
After successful payment: mark order PAID, deduct stock.
7.4 Invoicing
Auto-generate GST-compliant PDF invoice.
Send invoice via email.
7.5 Orders & tracking
Customer can see order history.
Show shipment tracking timeline via Shiprocket (or selected tracking API).
7.6 Admin CMS
Product CRUD with image upload.
Order list + detail view.
Ability to update order status.
Basic sales analytics dashboard.
Anand Arts Website + Admin CMS — PRD & Task List 4
8. Data model (high-level)
Users
Products (include HSN, price, stock, images)
Orders
OrderItems
Addresses (or embedded in Orders)
Payment records / webhook logs
9. Security & compliance requirements
Input validation (Zod).
Secure headers (Helmet or equivalent in Next.js).
No secrets committed to git (.env hygiene).
Parameterized queries / ORM safeguards.
Webhook verification and idempotency.
10. Performance requirements
Mobile-first UI.
Image optimization for high-resolution artwork.
Target Lighthouse 90+ on key pages.
11. Tech stack (proposed)
Next.js 15 (App Router)
Tailwind CSS + Lucide React
Server Actions for backend logic
PostgreSQL (Neon)
NextAuth v5 (Google OAuth + Phone OTP)
Cashfree payments
Cloudinary (images)
Resend + React-PDF (invoices)
Anand Arts Website + Admin CMS — PRD & Task List 5
12. Milestones (Phase 1–6)
Phase 1: Database + security foundation
Phase 2: Product + inventory engine (single item lock)
Phase 3: Checkout flow (guest cart → auth at payment)
Phase 4: Payment + webhooks + invoicing
Phase 5: User dashboard + tracking + admin CMS
Phase 6: QA + launch
Task list (implementation)
Phase 1 — Foundation
Confirm final sitemap + copy requirements for About/Customer Care pages
Define DB schema (Users, Products, Orders, OrderItems,
Payments/Webhook logs)
Set up Next.js project, Tailwind, linting/formatting
Set up environment variables and secret management
Add Zod validation patterns + security headers
Phase 2 — Products & inventory
Build product list page UI (search/filter/sort/product cards)
Product detail page (if required) + SEO metadata
Admin: Product CRUD screens
Implement inventory locking + auto-unlock job
Phase 3 — Cart & checkout
Guest cart in localStorage
Checkout page (address + optional GST)
Auth at payment step (OTP flow)
Persist user addresses for returning customers
Phase 4 — Payments & automation
Anand Arts Website + Admin CMS — PRD & Task List 6
Cashfree payment initiation + webhook verification
Webhook endpoint with verification + idempotency
Order state machine (CREATED → PAYMENT_INITIATED → PAID →
FULFILLED/CANCELLED)
Stock deduction on PAID
Invoice PDF generation + email sending
Phase 5 — Accounts, tracking, CMS
Customer dashboard: order history
Tracking integration (Shiprocket API) + timeline UI
Admin: orders list + status updates
Admin: basic analytics (sales charts)
Phase 6 — QA & launch
Test race condition (two users try to buy 1 item)
Performance pass (image optimization, caching, Lighthouse)
Content QA for Customer Care pages
Production deployment on Vercel + domain + env config
Post-launch checklist (monitoring/logs, webhook alerts)
Anand Arts Website + Admin CMS — PRD & Task List 7
