import axios from "axios";

/**
 * Shiprocket Tracking & Shipping Helper
 * Integrates with Shiprocket API for real-time artifact tracking and logistics.
 */

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || "";
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || "";
const BASE_URL = process.env.SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// --- Step 1: Authenticate & Get Token ---
async function getToken(): Promise<string | null> {
  // If we have a cached token that is not expired, use it
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });

    if (response.data.token) {
      cachedToken = response.data.token;
      // Tokens usually last 10 days, let's cache for 9 days
      tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
      return cachedToken;
    }
    return null;
  } catch (error: any) {
    console.error("Shiprocket Auth Error:", error.response?.data || error.message);
    return null;
  }
}

// --- Step 2: Get Tracking Details by AWB ---
export async function getShiprocketTracking(awb: string) {
  const token = await getToken();
  if (!token || !awb) return null;

  try {
    const response = await axios.get(`${BASE_URL}/courier/track/awb/${awb}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Shiprocket returns tracking data in an unusual format
    const trackingData = response.data?.tracking_data?.[awb];
    
    if (!trackingData) return null;

    return {
      status: trackingData.track_status,
      awb: awb,
      orderId: trackingData.shiprocket_order_id,
      courier: trackingData.courier_name,
      currentStatus: trackingData.shipment_status_name,
      scans: trackingData.shipment_track_activities || [],
      edd: trackingData.expected_delivery_date,
    };
  } catch (error: any) {
    console.error("Shiprocket Tracking Error:", error.response?.data || error.message);
    return null;
  }
}

// --- Step 3: Create Shipment (Sync with Shiprocket) ---
export async function createShiprocketOrder(order: any) {
  const token = await getToken();
  if (!token) return { success: false, error: "Authentication failed" };

  try {
    const payload = {
      order_id: order.orderNumber || order.id,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: "Primary", // Must match the location name in your Shiprocket dashboard
      billing_customer_name: order.user?.firstName || "Customer",
      billing_last_name: order.user?.lastName || "",
      billing_address: order.address?.houseNo || "",
      billing_address_2: order.address?.street || "",
      billing_city: order.address?.city || "",
      billing_pincode: order.address?.postalCode || "",
      billing_state: order.address?.state || "",
      billing_country: "India",
      billing_email: order.user?.email || "",
      billing_phone: order.user?.phone || "",
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.product.name,
        sku: item.product.slug || item.productId,
        units: item.quantity,
        selling_price: item.price / 100,
        discount: 0,
        tax: 0,
      })),
      payment_method: "Prepaid",
      shipping_charges: (order.estimatedShippingCost || 0) / 100,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: order.total / 100,
      length: 10, // Placeholder dimensions
      width: 10,
      height: 10,
      weight: 0.5, // Placeholder weight in KG
    };

    const response = await axios.post(`${BASE_URL}/orders/create/adhoc`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.order_id) {
      return { 
        success: true, 
        shiprocketOrderId: response.data.order_id, 
        shipmentId: response.data.shipment_id 
      };
    }
    
    throw new Error(response.data.message || "Failed to create Shiprocket order");
  } catch (error: any) {
    console.error("Shiprocket Order Creation Error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// --- Step 4: Check Serviceability & EDD ---
export async function checkShiprocketServiceability(deliveryPincode: string, weightGrams: number = 1000) {
  const token = await getToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${BASE_URL}/courier/serviceability/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pickup_postcode: "560003", // Anand Arts base origin
        delivery_postcode: deliveryPincode,
        weight: weightGrams / 1000, // Convert to KG
        cod: 0 // We only do prepaid
      }
    });

    const data = response.data?.data;
    
    // Find the fastest/recommended courier
    let bestCourier = null;
    if (data?.available_courier_companies && data.available_courier_companies.length > 0) {
      // Sort by estimated delivery date
      const couriers = data.available_courier_companies;
      bestCourier = couriers.reduce((prev: any, current: any) => {
        return (prev.etd < current.etd) ? prev : current;
      });
    }

    if (!bestCourier) {
      return { isServiceable: false };
    }

    return {
      isServiceable: true,
      edd: bestCourier.etd, // Estimated delivery date string
      courier: bestCourier.courier_name,
      estimatedDays: bestCourier.estimated_delivery_days
    };

  } catch (error: any) {
    console.error("Shiprocket Serviceability Error:", error.response?.data || error.message);
    return null;
  }
}
