"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { initiateCashfreePayment } from "@/lib/payments";
const PaymentStatus = {
  INITIATED: "INITIATED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;
const PaymentMethod = {
  CASHFREE: "CASHFREE",
  PHONEPE: "PHONEPE",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
} as const;

/**
 * Payment Server Actions
 * Handles initiating payment with PhonePe gateway and creating associated payment records in DB.
 */

export async function processOrderPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // --- Step 1: Fetch Order & Sanity Checks ---
  const order = await db.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { 
      user: { select: { phone: true, email: true } },
      address: true 
    },
  });

  if (!order) return { error: "Order not found" };
  if (order.total <= 0) return { error: "Invalid order amount" };

  // --- Step 2: Create Payment Intent ---
  const merchantTransactionId = `T-${Date.now()}-${orderId.slice(-4)}`;
  
  const payment = await db.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      merchantTransactionId,
      idempotencyKey: merchantTransactionId,
      status: PaymentStatus.INITIATED,
      method: "CASHFREE" as any, // Using string or casting as prisma enum is now updated
    },
  });

  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`;

  // --- Step 3: Call Cashfree Initiation ---
  try {
    const result = await initiateCashfreePayment({
      orderId: merchantTransactionId,
      orderAmount: order.total,
      customerDetails: {
        customerId: session.user.id,
        customerPhone: order.address.phone || order.user.phone || "9999999999",
        customerEmail: session.user.email || undefined,
        customerName: `${order.address.firstName} ${order.address.lastName}`
      },
      returnUrl: callbackUrl,
    });

    return { success: true, url: result.url };
  } catch (error: any) {
    console.error("Cashfree Initiation Error:", error.message);
    
    // Fallback: If gateway fails, update status
    await db.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    
    return { error: "Could not initiate payment. Gateway is currently unreachable." };
  }
}

/**
 * TEST MODE ONLY: Simulates a successful payment callback
 * Automatically marks order as PAID and triggers downstream automation.
 */
export async function simulatePaymentSuccess(orderId: string) {
  if (process.env.ALLOW_TEST_PAYMENTS !== "true") {
    throw new Error("Test payments are not enabled in this environment.");
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    // 1. Mark Payment as Success in DB
    const payment = await db.payment.findFirst({
      where: { orderId, status: "INITIATED" }
    });

    if (payment) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", webhookVerified: true }
      });
    }

    // 2. Mark Order as PAID
    await db.order.update({
      where: { id: orderId },
      data: { status: "PAID" }
    });

    // 3. Deduct Stock
    const orderItems = await db.orderItem.findMany({ where: { orderId } });
    for (const item of orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          reserved: { decrement: item.quantity }
        }
      });
    }

    // 4. Trigger Post-Payment Automation (Shiprocket & Invoice)
    // We'll call the logic directly or wait for the system to process.
    // For testing, we'll return a success flag so the UI can redirect.
    return { success: true };
  } catch (error: any) {
    console.error("Test Payment Error:", error.message);
    return { error: error.message };
  }
}
