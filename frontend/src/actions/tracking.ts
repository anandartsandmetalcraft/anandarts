"use server";

import { db } from "@/lib/db";
import { getShiprocketTracking } from "@/lib/shiprocket";

export async function trackOrderAction(input: { type: "order" | "tracking"; value: string }) {
  if (!input.value) {
    return { error: "Please enter a valid number" };
  }

  let awb = "";

  if (input.type === "order") {
    // Look up AWB from DB using order number
    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: input.value },
          { id: input.value } // Support both internal ID and order number
        ]
      },
      select: { trackingId: true }
    });

    if (!order) {
      return { error: "Order not found. Please check your order number." };
    }

    if (!order.trackingId) {
      return { 
        status: "Shipment is being prepared",
        message: "Your order has been received and is being prepared for dispatch."
      };
    }
    awb = order.trackingId;
  } else {
    awb = input.value;
  }

  // Call Shiprocket API
  const trackingData = await getShiprocketTracking(awb);

  if (!trackingData) {
    return { error: "No tracking information found for this number." };
  }

  return { success: true, data: trackingData };
}
