import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPhonePeWebhook, checkCashfreeStatus } from "@/lib/payments";
import { logActivity } from "@/actions/activity";
import { sendOrderConfirmationEmail } from "@/lib/emails";
import { createShiprocketOrder } from "@/lib/shiprocket";

const OrderStatus = {
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
const PaymentStatus = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

/**
 * PhonePe Webhook/Callback Route
 * Final endpoint for payment status updates coming from PhonePe server.
 */

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let merchantTransactionId = "";
  let pgTransactionId = "";
  let isCashfree = false;

  // --- Step 1: Detect Gateway & Extract ID ---
  if (contentType.includes("application/json")) {
    const json = await request.json();
    // Cashfree Webhook format
    if (json.data?.order?.order_id) {
      merchantTransactionId = json.data.order.order_id;
      isCashfree = true;
    }
  } else {
    const data = await request.formData();
    const base64Request = data.get("request") as string;
    const xVerify = data.get("x-verify") as string;

    if (base64Request && xVerify) {
      // PhonePe format
      const isValid = verifyPhonePeWebhook(base64Request, xVerify);
      if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      const payload = JSON.parse(Buffer.from(base64Request, "base64").toString("utf-8"));
      merchantTransactionId = payload.merchantTransactionId;
    }
  }

  if (!merchantTransactionId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // --- Step 2: Verify Status with Gateway (Server-to-Server) ---
  let isSuccess = false;
  let finalPayload: any = {};

  if (isCashfree) {
    const status = await checkCashfreeStatus(merchantTransactionId);
    isSuccess = status?.order_status === "PAID";
    pgTransactionId = status?.cf_order_id || "";
    finalPayload = status;
  } else {
    // Legacy PhonePe or other verification could go here
  }

  // --- Step 3: Atomic Update (Transaction) ---
  try {
    await db.$transaction(async (tx: any) => {
      const payment = await tx.payment.findUnique({
        where: { merchantTransactionId },
        include: { order: true },
      });

      if (!payment) {
        throw new Error(`Payment record not found for transaction: ${merchantTransactionId}`);
      }

      // If already processed, skip
      if (
        payment.status === PaymentStatus.SUCCESS ||
        payment.status === PaymentStatus.FAILED ||
        payment.status === PaymentStatus.REFUNDED
      ) {
        console.log(`Payment ${merchantTransactionId} already processed, skipping.`);
        return;
      }

      const isRefunded = isCashfree 
        ? finalPayload?.order_status === "REFUNDED"
        : false; // PhonePe refund logic would go here

      // Update Order & Payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          cashfreeTransactionId: isCashfree ? pgTransactionId : undefined,
          phonePeTransactionId: !isCashfree ? pgTransactionId : undefined,
          webhookPayload: JSON.stringify(finalPayload),
          webhookVerified: true,
        },
      });

      if (isRefunded) {
        const paidAmount = payment.amount ?? payment.order.total;
        const pgFeeDeducted = Math.round(paidAmount * 0.0236);
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: OrderStatus.REFUNDED,
            pgFeeDeducted,
            // Profit-first safety: reflect lost PG fee + shipping cost.
            netProfit: -(pgFeeDeducted + (payment.order.estimatedShippingCost ?? 0)),
          },
        });

        console.log(`Order ${payment.orderId} marked as REFUNDED and net profit adjusted.`);
        return;
      }

      if (isSuccess) {
        const paidAmount = payment.amount ?? payment.order.total;
        const pgFeeDeducted = Math.round(paidAmount * 0.0236);
        const netProfit =
          paidAmount -
          ((payment.order.productCogs ?? 0) +
            pgFeeDeducted +
            (payment.order.estimatedShippingCost ?? 0) +
            (payment.order.packagingBuffer ?? 0));

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.PAID, pgFeeDeducted, netProfit },
        });

        // Stock deduction already handled during delivery per state machine in admin.ts
        // But if stock deduction happens on PAID, we can add it here.
        // PRD says: "After successful payment: mark order PAID, deduct stock."
        // We'll update reserved count and actual stock here.

        const orderItems = await tx.orderItem.findMany({
          where: { orderId: payment.orderId },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reserved: { decrement: item.quantity }
            }
          });
        }

        console.log(`Order ${payment.orderId} marked as PAID and stock deducted.`);
      } else {
        // Release reserved stock on FAILED payment
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: payment.orderId },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { reserved: { decrement: item.quantity } },
          });
        }

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CANCELLED },
        });

        console.log(`Order ${payment.orderId} marked as CANCELLED due to payment failure.`);
      }
    });

    if (isSuccess) {
      try {
        const { sendInvoiceEmail } = await import("@/actions/emails");
        const paymentRecord = await db.payment.findUnique({
          where: { merchantTransactionId },
          include: { 
            order: { 
              include: { 
                user: true, 
                address: true,
                items: { include: { product: true } }
              } 
            } 
          }
        });
        
        if (paymentRecord?.order) {
          // 1. Generate & Send Invoice
          await sendInvoiceEmail(paymentRecord.orderId);
          
          // 2. Sync with Shiprocket
          console.log(`[CALLBACK] Syncing order ${paymentRecord.order.orderNumber} with Shiprocket...`);
          const shipResult = await createShiprocketOrder(paymentRecord.order);
          
          if (shipResult.success) {
            await db.order.update({
              where: { id: paymentRecord.orderId },
              data: { 
                trackingId: String(shipResult.shiprocketOrderId),
                status: "CONFIRMED" // Move to confirmed once synced
              }
            });
            console.log(`[CALLBACK] Shiprocket sync successful for ${paymentRecord.orderId}`);
          } else {
            console.error(`[CALLBACK] Shiprocket sync failed: ${shipResult.error}`);
          }
        }
      } catch (error) {
        console.error("Error in post-payment automation:", error);
      }
    }

    const activityType =
      isSuccess
        ? "ORDER_PAID"
        : "PAYMENT_FAILED";
    void logActivity({
      type: activityType,
      title:
        isSuccess
          ? "Payment successful"
          : "Payment failed",
      description:
        isSuccess
          ? `Order ${merchantTransactionId} has been paid and stock was updated.`
          : `Payment for transaction ${merchantTransactionId} failed or was cancelled.`,
      referenceId: merchantTransactionId,
      metadata: {
        merchantTransactionId,
        pgTransactionId,
        isCashfree,
        status: finalPayload?.order_status || finalPayload?.code
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PhonePe Webhook Processing Error:", error.message);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
