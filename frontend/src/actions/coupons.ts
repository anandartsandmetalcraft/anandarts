"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getAdminContext } from "@/lib/adminAccess";

type CouponInput = {
  id?: string;
  title: string;
  code: string;
  productType?: string;
  startDate: string;
  endDate: string;
  discount: string;
  status?: string;
};

export async function getCouponsList() {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return [];
  }

  return db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveCouponsList() {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return [];
  }

  return db.coupon.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertCoupon(input: CouponInput) {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return { error: "Access denied" };
  }

  try {
    const parsedDiscount = String(input.discount).trim();
    const code = input.code.toUpperCase();

    const coupon = input.id
      ? await db.coupon.update({
          where: { id: input.id },
          data: {
            title: input.title,
            code,
            productType: input.productType || "all",
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            discount: parsedDiscount,
            status: input.status || "ACTIVE",
          },
        })
      : await db.coupon.upsert({
          where: { code },
          update: {
            title: input.title,
            productType: input.productType || "all",
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            discount: parsedDiscount,
            status: input.status || "ACTIVE",
          },
          create: {
            title: input.title,
            code,
            productType: input.productType || "all",
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            discount: parsedDiscount,
            status: input.status || "ACTIVE",
          },
        });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/products/new");
    revalidatePath("/admin/products/edit");
    revalidatePath("/collections");
    revalidatePath("/");
    return { success: true, coupon };
  } catch (error: any) {
    console.error("Coupon save error:", error);
    return { error: error.message || "Failed to save coupon." };
  }
}

export async function deleteCoupon(id: string) {
  const admin = await getAdminContext();
  if (!admin.allowed) {
    return { error: "Access denied" };
  }

  try {
    await db.$transaction(async (tx) => {
      const coupon = await tx.coupon.findUnique({
        where: { id },
        select: { code: true },
      });

      if (coupon?.code) {
        await tx.product.updateMany({
          where: { couponCode: coupon.code },
          data: { couponCode: null },
        });
      }

      await tx.coupon.delete({ where: { id } });
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/products/new");
    revalidatePath("/admin/products/edit");
    revalidatePath("/collections");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Coupon delete error:", error);
    return { error: error.message || "Failed to delete coupon." };
  }
}

/**
 * Public function to validate a coupon code
 */
export async function validateCoupon(code: string) {
  if (!code) return { error: "Please enter a code." };

  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { error: "Invalid coupon code." };
  }

  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (coupon.status !== "ACTIVE") {
    return { error: "This coupon is no longer active." };
  }

  if (now < startDate) {
    return { error: "This coupon is not yet active." };
  }

  if (now > endDate) {
    return { error: "EXPIRED: This coupon expired on " + endDate.toLocaleDateString() };
  }

  return { 
    success: true, 
    discount: coupon.discount,
    title: coupon.title
  };
}
