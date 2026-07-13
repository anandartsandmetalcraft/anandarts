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

import { getShiprocketTrackingByShipmentId, assignShiprocketAWB, requestShiprocketPickup } from "@/lib/shiprocket";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/actions/activity";

export async function syncShiprocketStatusesAction() {
  try {
    const orders = await db.order.findMany({
      where: {
        status: { in: ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"] },
        shiprocketShipmentId: { not: null },
      },
    });

    let updatedCount = 0;

    for (const order of orders) {
      if (!order.shiprocketShipmentId) continue;
      
      const trackingData = await getShiprocketTrackingByShipmentId(order.shiprocketShipmentId);
      if (!trackingData) continue;

      let newStatus = order.status;
      const shiprocketStatus = trackingData.currentStatus?.toLowerCase() || "";

      if (shiprocketStatus.includes("delivered")) {
        newStatus = "DELIVERED";
      } else if (shiprocketStatus.includes("out for delivery")) {
        newStatus = "OUT_FOR_DELIVERY";
      } else if (shiprocketStatus.includes("shipped") || shiprocketStatus.includes("in transit") || shiprocketStatus.includes("picked up")) {
        newStatus = "SHIPPED";
      }

      // If status changed or AWB was newly assigned
      const awbCode = trackingData.awb || (trackingData as any)?.shipment_track?.[0]?.awb_code;

      if (newStatus !== order.status || (awbCode && awbCode !== order.trackingId)) {
        await db.order.update({
          where: { id: order.id },
          data: {
            status: newStatus as any,
            trackingId: awbCode || order.trackingId,
            shippingCarrier: trackingData.courier || order.shippingCarrier,
          },
        });

        // Log activity if status changed
        if (newStatus !== order.status) {
          void logActivity({
            type: "SHIPPING_UPDATED",
            title: `Order ${newStatus.toLowerCase().replace('_', ' ')}`,
            description: `Order ${order.orderNumber} status updated from Shiprocket.`,
            referenceId: order.id,
            href: `/admin/orders/${order.id}`,
            metadata: {
              previousStatus: order.status,
              nextStatus: newStatus,
              trackingId: awbCode,
            },
          });
        }
        updatedCount++;
      }
    }
    
    revalidatePath("/admin/shipping/list");
    revalidatePath("/admin/orders");
    
    return { success: true, updatedCount };
  } catch (error: any) {
    console.error("Sync Tracking Error:", error);
    return { error: "Failed to sync tracking data." };
  }
}

export async function schedulePickupAction(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return { error: "Order not found" };
    if (!order.shiprocketShipmentId) return { error: "Shipment ID not found. Has this been synced with Shiprocket?" };
    if (order.trackingId) return { error: "Pickup is already scheduled for this order." };

    // 1. Assign AWB (this picks the best courier automatically)
    const awbResult = await assignShiprocketAWB(order.shiprocketShipmentId);
    if (!awbResult.success) {
      return { error: awbResult.error || "Failed to assign AWB." };
    }

    // 2. Request Pickup
    const pickupResult = await requestShiprocketPickup(order.shiprocketShipmentId);
    if (!pickupResult.success) {
      return { error: pickupResult.error || "Failed to request pickup. AWB was generated but pickup scheduling failed." };
    }

    // 3. Update DB
    await db.order.update({
      where: { id: order.id },
      data: {
        trackingId: awbResult.awbCode,
        shippingCarrier: awbResult.courierName,
        status: "SHIPPED" // Mark as shipped once pickup is scheduled
      }
    });

    // 4. Log Activity
    void logActivity({
      type: "SHIPPING_UPDATED",
      title: "Pickup Scheduled",
      description: `Pickup scheduled via ${awbResult.courierName} for order ${order.orderNumber}.`,
      referenceId: order.id,
      href: `/admin/orders/${order.id}`,
      metadata: {
        awb: awbResult.awbCode,
        courier: awbResult.courierName
      },
    });

    revalidatePath("/admin/shipping/list");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${order.id}`);

    return { success: true, awb: awbResult.awbCode, courier: awbResult.courierName };
  } catch (error: any) {
    console.error("Schedule Pickup Error:", error);
    return { error: error.message || "Failed to schedule pickup" };
  }
}
