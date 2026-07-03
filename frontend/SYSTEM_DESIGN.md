1. Database Indexing (Essential for Speed)
Performance: Since we have high-resolution images and many attributes (Material, Weight, HSN), search must be fast.

Requirement: Index columns like product_id, category, and material in PostgreSQL. This ensures that even with 10,000 statues, the "Brass" category page loads in milliseconds.

2. Caching (Lighthouse 90+ Score)
Performance: We use Next.js ISR (Incremental Static Regeneration).

Requirement: The homepage and product catalog should be cached on the Vercel Edge. Data only updates from the DB when a new product is added. This ensures a sub-500ms load time.

3. SQL vs NoSQL (The Choice: SQL)
Performance: We use PostgreSQL.

Requirement: E-commerce requires "ACID" compliance. When a user buys a unique statue, we cannot have a "NoSQL" delay where someone else buys it at the same time. The database must be the "single source of truth."

4. Idempotency (Payment Safety)
Performance: Critical for Cashfree Webhooks.

Requirement: If Cashfree sends the "Payment Success" signal twice due to a network glitch, our code must check if the order is already marked as PAID. This prevents double-deduction of stock.

5. Database Transactions (The Inventory Lock)
Performance: Critical for "Unique Item" sales.

Requirement: When a user initiates payment, the is_locked status and the Order creation must happen in a single Database Transaction. If one part fails, everything rolls back.

6. CDN (Content Delivery Network)
Performance: We use Cloudinary + Vercel.

Requirement: Statue images are heavy. They must be served from a CDN node closest to the user (e.g., a Bengaluru user gets the image from a Bengaluru server, not a US server).

7. Webhooks (Real-time Status)
Performance: Used for Cashfree and Shiprocket.

Requirement: Our backend must have a secure payment callback/webhook route to receive live updates. This is how the "Order Confirmation" email is triggered automatically.

8. Blob Storage
Performance: Do not store images in PostgreSQL.

Requirement: All raw statue photos go to Cloudinary or AWS S3. We only store the URL string in our database.

9. Rate Limiting
Performance: Security against bots.

Requirement: Limit the OTP Login attempts to 5 per 10 minutes per IP address. This prevents attackers from burning your SMS credits (2Factor.in) or trying to brute-force accounts.

10. APIs (Rest vs GraphQL)
Performance: We use REST (Next.js Server Actions).

Requirement: Since this is a specialized store, Server Actions are faster to implement and easier for the AI to maintain than a full GraphQL layer.

11. Context-Aware Data Fetching (Anti-Bloat)
Performance: "Each Screen -> Optimized API" Philosophy.

Requirement: Never fetch the full object (e.g., User with Orders and Sessions) for a display-only component (e.g., Navbar Name). Use Prisma "select" to fetch only the required fields. This minimizes the database payload (Lower Scaling Cost) and prevents sensitive data leakage.
