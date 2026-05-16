"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { logActivity } from "@/actions/activity";
import { revalidatePath } from "next/cache";
import { isCouponExpired, parseCouponDiscount } from "@/lib/coupons";
import { calculateGiftWrapFeePaise, calculateShippingChargePaise, isRemotePincode } from "@/lib/shipping";

const OrderStatus = {
  CREATED: "CREATED",
  PAID: "PAID",
} as const;
type OrderStatus = keyof typeof OrderStatus;

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `AA-${dateStr}-${random}`;
}

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function createOrder(
  items: CartItemInput[],
  checkoutData: CheckoutInput
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to place an order" };
  }

  const parsed = checkoutSchema.safeParse(checkoutData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (!items.length) {
    return { error: "Cart is empty" };
  }

  const productIds = items.map((item) => item.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
  });

  const attachedCouponCodes = Array.from(
    new Set(
      products
        .map((product: any) => product.couponCode?.trim().toUpperCase())
        .filter(Boolean)
    )
  );
  const coupons = attachedCouponCodes.length
    ? await db.coupon.findMany({
        where: { code: { in: attachedCouponCodes } },
      })
    : [];
  const couponMap = new Map(coupons.map((coupon) => [coupon.code.toUpperCase(), coupon]));
  const productsWithCoupons = products.map((product: any) => ({
    ...product,
    coupon: product.couponCode ? couponMap.get(product.couponCode.toUpperCase()) || null : null,
  }));

  if (products.length !== items.length) {
    return { error: "Some products are no longer available" };
  }

  for (const item of items) {
    const product = productsWithCoupons.find((p: any) => p.id === item.productId);
    if (!product) return { error: "Product not found" };

    const availableStock = product.stock - product.reserved;
    if (availableStock < item.quantity) {
      return {
        error: `"${product.name}" only has ${availableStock} available`,
      };
    }
  }

  const orderItems = items.map((item) => {
    const product = productsWithCoupons.find((p: any) => p.id === item.productId)!;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      total: product.price * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  let discount = 0;

  const enteredCoupon = parsed.data.couponCode?.trim();
  if (enteredCoupon) {
    const matchingProduct = productsWithCoupons.find(
      (product: any) => product.couponCode?.toLowerCase() === enteredCoupon.toLowerCase()
    );

    if (!matchingProduct) {
      const enteredCouponRecord = couponMap.get(enteredCoupon.toUpperCase());
      if (enteredCouponRecord && isCouponExpired(enteredCouponRecord)) {
        return { error: "Coupon expired." };
      }
      return { error: "This coupon does not apply to items in your cart." };
    }

    const coupon = matchingProduct.coupon;
    if (!coupon) {
      return { error: "This coupon does not apply to items in your cart." };
    }

    if (isCouponExpired(coupon)) {
      return { error: "Coupon expired." };
    }

    const matchingLineItems = items.filter((item) => item.productId === matchingProduct.id);
    const matchingSubtotal = matchingLineItems.reduce((sum, item) => {
      return sum + matchingProduct.price * item.quantity;
    }, 0);

    const parsedCoupon = parseCouponDiscount(coupon.discount);
    if (parsedCoupon.type === "PERCENT") {
      discount = Math.round((matchingSubtotal * parsedCoupon.value) / 100);
    } else {
      discount = Math.min(matchingSubtotal, Math.round(parsedCoupon.value * 100));
    }
  }

  const isStorePickup = parsed.data.notes === "STORE_PICKUP";
  
  const deliveryPostalCode = !isStorePickup && parsed.data.addressId
    ? (await db.address.findUnique({
        where: { id: parsed.data.addressId },
        select: { postalCode: true },
      }))?.postalCode
    : null;

  const isRemoteArea = !isStorePickup && isRemotePincode(deliveryPostalCode);
  const shippingCharge = calculateShippingChargePaise({
    subtotalPaise: subtotal,
    isStorePickup,
    postalCode: deliveryPostalCode,
  });

  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const giftWrapFee = calculateGiftWrapFeePaise({
    isGiftWrapped: Boolean(parsed.data.isGiftWrapped),
    totalQuantity,
  });
  
  // Tax calculation: Flat 5% for all handicrafts (as per your latest request)
  const tax = Math.round((subtotal + giftWrapFee) * 0.05);
  const total = Math.max(0, subtotal + shippingCharge + giftWrapFee + tax - discount);

  // Financial Engine metrics
  const pgFeeDeducted = Math.round(total * 0.0236);
  const productCogs = Math.round(subtotal * 0.4); // 40% COGS estimate
  const packagingBuffer = 10000; // ₹100
  const estimatedShippingCost = isStorePickup ? 0 : (isRemoteArea ? 30000 : 15000);
  const netProfit = total - (productCogs + pgFeeDeducted + estimatedShippingCost + packagingBuffer);

  const order = await db.$transaction(async (tx: any) => {
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { reserved: { increment: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId: parsed.data.addressId,
        status: OrderStatus.CREATED,
        subtotal,
        shippingCharge,
        tax,
        discount,
        total,
        isGiftWrapped: Boolean(parsed.data.isGiftWrapped),
        giftWrapFee,
        pgFeeDeducted,
        productCogs,
        packagingBuffer,
        estimatedShippingCost,
        netProfit,
        gstNumber: parsed.data.gstNumber,
        companyName: parsed.data.companyName,
        notes: parsed.data.notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });
  });

  void logActivity({
    type: "ORDER_CREATED",
    title: "New order placed",
    description: `Order ${order.orderNumber} was created and inventory was reserved.`,
    href: `/admin/orders/${order.id}`,
    referenceId: order.id,
    metadata: {
      orderNumber: order.orderNumber,
      total: order.total,
      userId: session.user.id,
    },
  });

  revalidatePath("/account");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/shipping/shipments");
  revalidatePath("/admin");

  return { success: true, orderId: order.id, orderNumber: order.orderNumber };
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      address: true,
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
      address: true,
      payments: true,
      invoice: true,
    },
  });
}
