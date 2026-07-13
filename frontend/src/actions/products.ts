"use server";

import { Prisma } from "@prisma/client";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { type CatalogQuery } from "@/lib/validations";

/**
 * Product Data Layer — Cached & Optimised
 * ────────────────────────────────────────────────────────────────
 * Scalability Plan §2: Multi-Layer Caching.
 *
 * L1: unstable_cache wraps all DB queries with tag-based invalidation.
 *     Admin mutations call revalidateTag() for surgical cache purge.
 * L2: Next.js Data Cache stores serialised results globally.
 *
 * ARCHITECTURE:
 * - Read functions: wrapped in unstable_cache with tags
 * - DB is the single source of truth — NO static fallbacks
 * - Cache tags: "products", "categories" for surgical invalidation
 * ────────────────────────────────────────────────────────────────
 */

type ProductImage = {
  url: string;
  sortOrder: number;
  isPrimary: boolean;
};

type ProductRecord = {
  id: string;
  name: string;
  material: string;
  category: string;
  size: string;
  price: number;
  img: string;
  tag: string;
  stock?: number;
  description?: string;
  thumbnails?: string[];
  slug?: string;
  compareAt?: number | null;
  images?: ProductImage[];
  isActive?: boolean;
  couponCode?: string | null;
  coupon?: {
    id: string;
    code: string;
    discount: string;
    startDate: Date;
    endDate: Date;
    status: string;
    productType?: string;
  } | null;
};

// ── Cloudinary URL Optimisation ─────────────────────────────────
/**
 * Ensures a Cloudinary URL includes f_auto,q_auto transformations
 * for guaranteed WebP/AVIF delivery and quality optimization.
 * This is defence-in-depth — Cloudinary already has fetch_format: auto
 * set at upload time, but adding it to the URL guarantees it.
 */
function optimizeCloudinaryUrl(url: string): string {
  if (!url) return url;

  // Only process Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) return url;

  // If already has f_auto or q_auto, skip
  if (url.includes("/f_auto") || url.includes(",f_auto")) return url;

  // Insert f_auto,q_auto after /upload/
  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto/"
  );
}

function normalizeProduct(product: any): ProductRecord {
  const images = (product.images ?? [])
    .slice()
    .sort((a: ProductImage, b: ProductImage) => a.sortOrder - b.sortOrder);
  const primaryImage = images.find((image: ProductImage) => image.isPrimary) ?? images[0];
  const thumbnails = images.map((image: ProductImage) => optimizeCloudinaryUrl(image.url));

  return {
    id: product.id,
    name: product.name,
    material: product.material,
    category: product.category?.name ?? product.category ?? "Uncategorized",
    size: product.size,
    price: product.price,
    img: optimizeCloudinaryUrl(primaryImage?.url ?? thumbnails[0] ?? "/placeholder.jpg"),
    tag: product.tag ?? "",
    stock: product.stock ?? 0,
    description: product.description ?? undefined,
    thumbnails: thumbnails.length > 1 ? thumbnails.slice(1) : thumbnails,
    slug: product.slug,
    compareAt: product.compareAt ?? null,
    images: images.map((img: ProductImage) => ({
      ...img,
      url: optimizeCloudinaryUrl(img.url),
    })),
    isActive: product.isActive,
    couponCode: product.couponCode ?? null,
    coupon: product.coupon
      ? {
        id: product.coupon.id,
        code: product.coupon.code,
        discount: product.coupon.discount,
        startDate: product.coupon.startDate,
        endDate: product.coupon.endDate,
        status: product.coupon.status,
        productType: product.coupon.productType,
      }
      : null,
  };
}

async function attachCoupons(products: any[]) {
  const codes = Array.from(
    new Set(
      products
        .map((product) => product.couponCode?.trim().toUpperCase())
        .filter(Boolean)
    )
  );

  const coupons = codes.length
    ? await db.coupon.findMany({
      where: { code: { in: codes } },
    })
    : [];

  const couponMap = new Map(coupons.map((coupon) => [coupon.code.toUpperCase(), coupon]));
  return products.map((product) => ({
    ...product,
    coupon: product.couponCode ? couponMap.get(product.couponCode.toUpperCase()) || null : null,
  }));
}

function normalizeProducts(products: any[]): ProductRecord[] {
  return products.map((product) => normalizeProduct(product));
}

// =============================================================
// CACHED DB QUERY LAYER
// Each function is wrapped with unstable_cache for L1 caching.
// Tags enable surgical invalidation from admin mutations.
// =============================================================

const cachedDbProducts = unstable_cache(
  async (queryKey: string) => {
    const query: CatalogQuery = JSON.parse(queryKey);
    const page = query.page || 1;
    const limit = query.limit || 18;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { isActive: true };
    const filters: Prisma.ProductWhereInput[] = [];

    if (query.category && query.category !== "All") {
      const categoryQuery = query.category.toLowerCase();
      filters.push({
        OR: [
          { category: { slug: { contains: categoryQuery, mode: "insensitive" } } },
          { category: { name: { contains: query.category, mode: "insensitive" } } },
          { material: { contains: query.category, mode: "insensitive" } },
        ],
      });
    }

    if (query.material && query.material !== "All") {
      const materialQuery = query.material;
      filters.push({
        OR: [
          { material: { contains: materialQuery, mode: "insensitive" } },
          { category: { name: { contains: materialQuery, mode: "insensitive" } } },
          { category: { slug: { contains: materialQuery.toLowerCase(), mode: "insensitive" } } },
        ],
      });
    }

    if (query.size && query.size !== "All") {
      filters.push({ size: { contains: query.size, mode: "insensitive" } });
    }

    if (query.minPrice !== undefined) {
      filters.push({ price: { gte: query.minPrice } });
    }

    if (query.maxPrice !== undefined) {
      filters.push({ price: { lte: query.maxPrice } });
    }

    if (query.minHeight !== undefined) {
      filters.push({ heightInInches: { gte: query.minHeight } } as any);
    }

    if (query.maxHeight !== undefined) {
      filters.push({ heightInInches: { lte: query.maxHeight } } as any);
    }

    if (query.search) {
      filters.push({
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
          { material: { contains: query.search, mode: "insensitive" } },
          { tag: { contains: query.search, mode: "insensitive" } },
          { category: { name: { contains: query.search, mode: "insensitive" } } },
        ],
      });
    }

    if (filters.length > 0) {
      where.AND = filters;
    }

    const sort: Prisma.ProductOrderByWithRelationInput =
      query.sort === "price_asc"
        ? { price: "asc" }
        : query.sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" };

    const [total, dbProducts] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: sort,
        skip,
        take: limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
    ]);

    const productsWithCoupons = await attachCoupons(dbProducts);
    return {
      products: normalizeProducts(productsWithCoupons),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      source: "db" as const,
    };
  },
  ["products-catalog"],
  { tags: ["products"], revalidate: 300 } // 5 minute TTL
);

// Optimized Feed Query with Dynamic Caching
const getCachedFeed = (limit: number, tag?: string) => unstable_cache(
  async () => {
    console.log(`[DB] Fetching feed: limit=${limit}, tag=${tag || 'none'}`);
    const dbProducts = await db.product.findMany({
      where: {
        isActive: true,
        ...(tag ? { tag: { contains: tag, mode: "insensitive" } } : {})
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        material: true,
        stock: true,
        tag: true,
        size: true,
        slug: true,
        couponCode: true,
        description: true,
        category: { select: { name: true } },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: { url: true, isPrimary: true }
        },
      },
    });

    // Attach coupons for feed products too
    const productsWithCoupons = await attachCoupons(dbProducts);

    return productsWithCoupons.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      material: p.material,
      size: p.size,
      tag: p.tag,
      slug: p.slug,
      stock: p.stock ?? 0,
      category: (p.category as any)?.name ?? "Artifact",
      img: optimizeCloudinaryUrl(p.images?.find((i: any) => i.isPrimary)?.url ?? p.images?.[0]?.url ?? "/placeholder.jpg"),
      coupon: p.coupon || null,
    }));
  },
  ["products-feed", limit.toString(), tag || "all"],
  { tags: ["products"], revalidate: 300 }
)();

const cachedDbProductBySlug = unstable_cache(
  async (slug: string) => {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { firstName: true, lastName: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (product) {
      const [productWithCoupon] = await attachCoupons([product]);
      return normalizeProduct(productWithCoupon);
    }

    return null;
  },
  ["product-detail"],
  { tags: ["products"], revalidate: 300 }
);

const cachedDbCategories = unstable_cache(
  async () => {
    return await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  },
  ["categories"],
  { tags: ["categories"], revalidate: 600 } // 10 minute TTL — categories change rarely
);

const cachedDbProductById = unstable_cache(
  async (id: string) => {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (product) {
      const [productWithCoupon] = await attachCoupons([product]);
      return normalizeProduct(productWithCoupon);
    }

    return null;
  },
  ["product-by-id"],
  { tags: ["products"], revalidate: 300 }
);

// =============================================================
// GET PRODUCTS — Server-side filtered, sorted, paginated
// DB is the single source of truth. No static fallbacks.
// =============================================================

export async function getProducts(query: CatalogQuery) {
  try {
    const queryKey = JSON.stringify(query);
    return await cachedDbProducts(queryKey);
  } catch (error) {
    console.error("DB product fetch failed:", error);
    // Return empty result set — never fall back to fake data
    return {
      products: [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 18,
      totalPages: 0,
    };
  }
}

// =============================================================
// GET FEED PRODUCTS — High performance "Slim" query
// Used for Home Layouts (Bestsellers, Recommendation, Catalog Preview)
// DB-only: returns empty array if no products exist.
// =============================================================

export async function getFeedProducts(args: { limit: number; tag?: string }) {
  const { limit, tag } = args;

  try {
    return await getCachedFeed(limit, tag);
  } catch (error) {
    console.error("Feed fetch failed:", error);
    return [];
  }
}

// =============================================================
// GET SINGLE PRODUCT — By slug or ID
// DB-only: returns null if product doesn't exist.
// =============================================================

export async function getProductBySlug(slug: string) {
  try {
    return await cachedDbProductBySlug(slug);
  } catch (error) {
    console.error("Product lookup by slug failed:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    return await cachedDbProductById(id);
  } catch (error) {
    console.error("Product lookup by id failed:", error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<any[]> {
  const uniqueIds = Array.from(new Set((ids || []).map((id) => String(id)).filter(Boolean))).slice(0, 12);
  if (uniqueIds.length === 0) return [];

  const results = await Promise.all(uniqueIds.map((id) => getProductById(id)));
  return results.filter((product): product is any => Boolean(product));
}

// =============================================================
// GET CATEGORIES
// DB-only: returns empty array if no categories exist.
// =============================================================

export async function getCategories() {
  try {
    return await cachedDbCategories();
  } catch {
    return [];
  }
}

// =============================================================
// SEARCH PRODUCTS
// DB-only: returns empty array if search fails.
// =============================================================

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const dbResults = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { material: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tag: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 8,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const resultsWithCoupons = await attachCoupons(dbResults);
    return normalizeProducts(resultsWithCoupons);
  } catch (error) {
    console.error("Product search failed:", error);
    return [];
  }
}

// =============================================================
// CACHE INVALIDATION HELPER
// Called from admin actions to surgically clear product caches.
// =============================================================

export async function invalidateProductCaches() {
  // Clear data cache for product-related tags
  // In Next.js 16, revalidateTag requires a second argument (behavior profile)
  revalidateTag("products", "max");
  revalidateTag("categories", "max");

  // Force re-render of key user-facing pages
  revalidatePath("/", "layout");
  revalidatePath("/collections", "page");
  revalidatePath("/product/[slug]", "page");
}
