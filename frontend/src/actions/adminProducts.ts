"use server";

import { db } from "@/lib/db";
import { getAdminContext } from "@/lib/adminAccess";
import { logActivity } from "@/actions/activity";
import { invalidateProductCaches } from "@/actions/products";
import { z } from "zod";

/**
 * Admin Product CRUD — Enterprise-Grade
 * ────────────────────────────────────────────────────────────────
 * Scalability Plan §2: Surgical cache invalidation.
 *
 * CHANGE: Replaced revalidatePath() with revalidateTag() via
 *         invalidateProductCaches(). This invalidates only the
 *         product/category caches, not entire page trees.
 *
 * SECURITY:
 * - Admin context verified on every mutation
 * - Input validated with Zod before touching the DB
 * - Transactions used for atomic operations
 * - Slug uniqueness enforced at DB level (P2002 handled)
 * ────────────────────────────────────────────────────────────────
 */

const productUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  material: z.string(),
  size: z.string(),
  weight: z.string().optional(),
  hsnCode: z.string().optional(),
  price: z.number().int().positive(), // in paise
  compareAt: z.number().int().optional(),
  stock: z.number().int().nonnegative(),
  tag: z.string().optional(),
  couponCode: z.string().optional().nullable(),
  categoryId: z.string(),
  images: z.array(z.object({
    url: z.string().min(1),
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().default(0)
  })),
  isActive: z.boolean().default(true)
});

const productStockSchema = z.object({
  id: z.string().min(1),
  stock: z.number().int().nonnegative(),
});

const adminProductsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

/**
 * UPSERT PRODUCT
 */
export async function upsertProduct(data: z.infer<typeof productUpsertSchema>) {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return { error: "Access Denied: Master Curator lineage required." };
  }

  const parsed = productUpsertSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, images, ...rest } = parsed.data;

  try {
    const product = await db.$transaction(async (tx) => {
      let p;
      if (id) {
        // Update product metadata
        p = await tx.product.update({
          where: { id },
          data: { ...rest },
        });

        // Sync images (delete old, insert new)
        await tx.productImage.deleteMany({ where: { productId: id } });
        for (const img of images) {
          await tx.productImage.create({
            data: { ...img, productId: id }
          });
        }
      } else {
        // Create new product
        p = await tx.product.create({
          data: {
            ...rest,
            images: {
              create: images
            }
          }
        });
      }
      return p;
    });

    // Surgical cache invalidation — only product/category caches
    await invalidateProductCaches();

    void logActivity({
      type: id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
      title: id ? "Product updated" : "Product created",
      description: `${product.name} was ${id ? "updated" : "added"} in the catalog.`,
      href: "/admin/products",
      referenceId: product.id,
      metadata: {
        productId: product.id,
        name: product.name,
        slug: product.slug,
      },
    });
    return { success: true, product };
  } catch (error: any) {
    console.error("Product Upsert Error:", error);
    if (error.code === "P2002") {
      return { error: "A masterpiece with this slug already persists in the sanctuary." };
    }

    return {
      error: error?.message || "An unexpected disturbance occurred while documenting the artifact.",
    };
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id: string) {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return { error: "Access Denied" };
  }

  try {
    // Check if product is in any orders
    const usedInOrders = await db.orderItem.count({ where: { productId: id } });
    if (usedInOrders > 0) {
      // Deep toggle off instead of delete
      const archived = await db.product.update({ where: { id }, data: { isActive: false } });

      // Surgical cache invalidation
      await invalidateProductCaches();

      void logActivity({
        type: "PRODUCT_DELETED",
        title: "Product archived",
        description: `${archived.name} was archived because it still appears in order history.`,
        href: "/admin/products",
        referenceId: archived.id,
        metadata: {
          productId: archived.id,
          name: archived.name,
          slug: archived.slug,
          archived: true,
        },
      });
      return { success: true, message: "Artifact archived as it exists in historical acquisition records." };
    }

    const deleted = await db.product.delete({ where: { id } });

    // Surgical cache invalidation
    await invalidateProductCaches();

    void logActivity({
      type: "PRODUCT_DELETED",
      title: "Product deleted",
      description: `${deleted.name} was permanently removed from the catalog.`,
      href: "/admin/products",
      referenceId: deleted.id,
      metadata: {
        productId: deleted.id,
        name: deleted.name,
        slug: deleted.slug,
        archived: false,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Product Delete Error:", error);
    return { error: "Failed to purge the artifact from the sanctuary registry." };
  }
}

/**
 * UPDATE PRODUCT STOCK
 */
export async function setProductStock(input: z.infer<typeof productStockSchema>) {
  const admin = await getAdminContext();
  if (!admin.allowed) return { error: "Access Denied" };

  const parsed = productStockSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { id, stock } = parsed.data;

  try {
    const updated = await db.product.update({
      where: { id },
      data: { stock },
    });

    await invalidateProductCaches();

    void logActivity({
      type: "PRODUCT_UPDATED",
      title: "Stock updated",
      description: `${updated.name} stock was set to ${stock}.`,
      href: "/admin/products",
      referenceId: updated.id,
      metadata: {
        productId: updated.id,
        name: updated.name,
        slug: updated.slug,
        stock,
      },
    });

    return { success: true, product: updated };
  } catch (error: any) {
    console.error("Product Stock Update Error:", error);
    if (error?.code === "P2025") {
      return { error: "Product not found in database." };
    }
    return { error: "Failed to update stock." };
  }
}

/**
 * ADMIN: LIST PRODUCTS (DB ONLY, no static fallback)
 */
export async function getAdminProducts(query: z.infer<typeof adminProductsQuerySchema>) {
  const admin = await getAdminContext();
  if (!admin.allowed) return { error: "Access Denied", products: [], total: 0 };

  const parsed = adminProductsQuerySchema.safeParse(query ?? {});
  if (!parsed.success) return { error: parsed.error.issues[0].message, products: [], total: 0 };

  const page = parsed.data.page ?? 1;
  const limit = parsed.data.limit ?? 100;
  const skip = (page - 1) * limit;
  const search = (parsed.data.search ?? "").trim();

  const where: any = search
    ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { material: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tag: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ],
    }
    : {};

  try {
    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  } catch (error: any) {
    console.error("Admin products fetch failed:", error);
    return { error: "Failed to load products.", products: [], total: 0 };
  }
}
